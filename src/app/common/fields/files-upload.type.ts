import { Component, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
// + HttpClient
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from 'app/app.constants';
import { filter, map } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'jhi-formly-file-gridfs',
  template: `
    <input type="file" (change)="addFile($event)" class="custom-input" [disabled]="to.maxFiles && model.length >= to.maxFiles" />
    <div class="card-deck" style="margin-bottom: 5px">
      <div class="card" *ngFor="let val of model; let i = index">
        <button type="button" (click)="removeFile(val, i)" class="btn btn-danger btn-block">
          <fa-icon icon="times"></fa-icon>
          Remove
        </button>
        <a [href]="getFileSrc(val)" [class]="to.className" target="_blank" *ngIf="!to.isImage">{{ val }}</a>
        <img [src]="getFileSrc(val)" [class]="to.className" *ngIf="to.isImage" />
      </div>
    </div>
  `
})
export class FormlyFilesUploadComponent extends FieldArrayType implements OnInit {
  fileToUpload: any = {};
  uploadedFiles: any[] = [];

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {}
  // API Endpoint for Retrieve File
  getFileSrc(fileId: any): string {
    return this.to.getFileSrc
      ? this.to.getFileSrc(fileId)
      : this.to.fileSrc
      ? this.to.fileSrc.replace('${fileId}', fileId)
      : SERVER_API_URL + _.get(this.to, 'apiEndpoint', 'api/public/gridfs') + `/${fileId}`;
  }

  removeFile(fileId: string, idx: number): void {
    this.httpClient.delete(SERVER_API_URL + _.get(this.to, 'apiEndpoint', 'api/gridfs') + `/${fileId}`).subscribe(
      () => _.pullAt(this.model, idx),
      () => _.pullAt(this.model, idx)
    );
  }

  // Upload a file to server, return the URL
  addFile(event: any): void {
    this.fileToUpload = event.target.files.item(0);
    this.uploadFile();
  }

  // API Endpoint for Upload File
  protected uploadFile(): void {
    this.formControl.setErrors({ uploading: true });
    const formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    this.httpClient.post(SERVER_API_URL + _.get(this.to, 'apiEndpoint', 'api/gridfs'), formData, { observe: 'response' })
    .pipe(
      filter(res => res.ok),
      map(res => res.body),
      map(res => this.postProcess(res))
    ).subscribe(
      res => {
        this.add(undefined, res);
        this.formControl.setErrors(null);
      },
      () => this.formControl.setErrors(null)
    );
  }

    // postProcess extract the file ID from the key
    postProcess(fileInfo: any): string {
      if (_.isString(fileInfo)) {
        return fileInfo;
      }
      if (this.to.key && _.isString(this.to.key) && _.isString(fileInfo[this.to.key])) {
        return fileInfo[this.to.key]
      }
      if (this.to.map) {
        if (_.isString(this.to.map)) {
          return _.template(this.to.map)(fileInfo);
        } else if (_.isFunction(this.to.map)) {
          return this.to.map(fileInfo);
        }
      }
      return '';
    }
}
