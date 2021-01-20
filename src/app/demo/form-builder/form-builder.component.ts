import { Component, OnInit } from '@angular/core';
// + lodash
import { FormBuilderService } from 'app/common/fields/form-builder.service';
import * as _ from 'lodash';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import * as jsyaml from 'js-yaml';

@Component({
  selector: 'jhi-form-builder',
  templateUrl: './form-builder.component.html'
})
export class FormBuilderComponent implements OnInit {
  contentType: any = {};
  contentTypeFields: any;
  isSaving: boolean;
  entry: any = {};
  previewForm = new FormGroup({});
  previewFormFields: FormlyFieldConfig[] = [];
  _ = _;

  constructor(public contentTypeService: FormBuilderService) {}

  ngOnInit() {
    this.contentType.fields = [
      { key: 'checkbox', type: 'checkbox', templateOptions: { label: 'Checkbox' } },
      { key: 'wysiwyg', type: 'quill', templateOptions: { label: 'What you see is what you get' } },
      { key: 'input', type: 'input', templateOptions: { label: 'Input' } },
      {
        key: 'radio',
        type: 'radio',
        templateOptions: {
          options: [{ value: 'A', label: 'Option A' }, { value: 'B', label: 'Option B' }, { value: 'C', label: 'Option C' }],
          label: 'Radio'
        }
      },
      {
        key: 'select',
        type: 'select',
        templateOptions: {
          options: [{ value: 'PlanA', label: 'Plan A' }, { value: 'planB', label: 'Plan B' }, { value: 'planC', label: 'Plan C' }],
          label: 'Select'
        }
      },
      {
        key: 'selectMulti',
        type: 'select',
        templateOptions: {
          options: [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }, { value: '3', label: 'Option 3' }],
          multiple: true,
          label: 'Multiple Select'
        }
      }
    ];
    this.renderPreviewForm();
  }

  // + Field Config manipulation
  // =================== PIPELINE MANAGEMENT ===================
  addField() {
    if (_.isEmpty(this.contentType.fields)) {
      this.contentType.fields = [];
    }
    this.contentType.fields.push({ key: '', type: '', templateOptions: {} });
  }
  removeField(index) {
    _.pullAt(this.contentType.fields, index);
  }
  renderPreviewForm() {
    this.contentType.fieldJson = JSON.stringify(this.contentType.fields);
    this.previewFormFields = _.concat([], this.contentType.fields);
    this.contentType.fields = JSON.parse(this.contentType.fieldJson);
    this.contentType.yaml = jsyaml.dump(JSON.parse(this.contentType.fieldJson));
  }
  submit() {
    console.log('FIXME: Submit the model', this.entry);
    alert(JSON.stringify(this.entry));
  }
  convertJson() {
    this.contentType.yaml = jsyaml.dump(JSON.parse(this.contentType.fieldJson));
    this.contentType.fields = JSON.parse(this.contentType.fieldJson);
    this.previewFormFields = _.concat([], this.contentType.fields);
  }
  convertYaml() {
    this.contentType.fields = jsyaml.load(this.contentType.yaml);
    this.contentType.fieldJson = JSON.stringify(jsyaml.load(this.contentType.yaml));
    this.previewFormFields = _.concat([], this.contentType.fields);
  }
  save() {
    alert(JSON.stringify(this.entry));
  }
}
