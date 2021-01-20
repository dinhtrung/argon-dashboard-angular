import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'jhi-docs',
  templateUrl: './docs.component.html'
})
export class DocsComponent implements OnInit {
  markdown: string;
  model: string;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ doc }) => {
      this.markdown = doc;
    });
  }
}
