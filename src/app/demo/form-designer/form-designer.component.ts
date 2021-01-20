import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import * as ini from 'ini';
import { ActivatedRoute } from '@angular/router';
import { Observable, from, concat, forkJoin, merge, empty } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';

@Component({
  selector: 'jhi-form-designer',
  templateUrl: './form-designer.component.html',
  styleUrls: ['./form-designer.component.scss']
})
export class FormDesignerComponent implements OnInit {
  // + ngx-formly
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  iniTemplate: string; // The template config
  model: any = {};
  modelPath: string[] = [];
  fields: FormlyFieldConfig[];
  arrayFields: any[] = [];
  arraySections: string[] = [];
  // +lodash
  _ = _;
  config: any = {};
  currentSection = '';
  currentComment = '';
  keyValueComment = '';
  currentLine = '';
  jsonMeta: any;
  sectionMeta: any;
  sectionFields: any[];

  constructor() {}

  ngOnInit() {}

  renderTemplate() {
    this.parseIniContent(this.iniTemplate);
  }

  // When click submit button => merge config file and tango file together
  submit() {
    alert(JSON.stringify(this.model));
  }

  // Parse the file and populate the config field. --> Render form based on INI
  //    config = { section: { jsonMeta: any, fieldGroup: { key1 : { value: 'val1', comment: 'The comment text behind value begin with #', jsonMeta: any}}}
  parseIniContent(content) {
    this.config = {};
    this.currentSection = '';
    this.currentComment = '';
    this.keyValueComment = '';
    this.currentLine = '';
    this.sectionFields = [];
    this.arrayFields = [];
    _.each(content.split('\n'), line => {
      // 1 - Check if current line is a comment
      if (line.match(/^(\s+)$/)) {
        return;
      }
      if (line.match(/^(\s+)?#/)) {
        this.currentComment += line;
        // 1b - Check if it contain any @JsonMeta annotation
        const jsonMeta = this.currentComment.match(/@JsonMeta\(([^\)]+)\)/i);
        if (jsonMeta) {
          this.jsonMeta = JSON.parse(jsonMeta[1]);
        }
        // 1c - Check if current comment contain any @Path annotation
        const path = this.currentComment.match(/@Path\(([^\)]+)\)/i);
        if (path) {
          this.modelPath = _.concat(this.modelPath, _.map(path[1].split(','), fileName => _.trim(fileName, '" ')));
          console.log('Need to load values inside file', _.map(path[1].split(','), fileName => _.trim(fileName, '" ')), this.modelPath);
        }
        // 1d - CHeck if current comment contain @SectionMeta annotation
        const sectionMeta = this.currentComment.match(/@SectionMeta\(([^\)]+)\)/i);
        if (sectionMeta) {
          this.sectionMeta = JSON.parse(sectionMeta[1]);
        }
      } else {
        // 2 - Check if this a new section
        const section = line.match(/\[([^\]]+)\]/);
        if (section) {
          if (!this.currentSection) {
            this.currentSection = section[1];
          }
          this.commitSection();
          this.currentSection = section[1];
          console.log('Found a new section', this.currentSection);
          // Reset old section variables
          this.currentComment = '';
          this.sectionFields = [];
          this.sectionMeta = {};
        }
        // 3 - Check if this is a key = value # comment
        const kvc = line.match(/([^=]+)=([^#]+)(#(.+))?/);
        if (kvc) {
          const fieldKey = _.get(kvc, 1).trim();
          const fieldValue = _.get(kvc, 2).trim();
          // See if this one annotate an array
          if (_.indexOf(['datatable', 'repeat', 'accordion'], _.get(this.jsonMeta, 'type')) > -1) {
            this.arrayFields.push({ section: this.currentSection, key: fieldKey });
          }
          this.sectionFields.push({
            key: fieldKey,
            value: fieldValue,
            comment: _.get(kvc, 4, '').trim(),
            jsonMeta: this.jsonMeta
          });
          this.currentComment = '';
          this.jsonMeta = {};
        }
      }
    });
    // Finalize the last section
    this.commitSection();
    // Finally, convert the config to form fields
    this.renderForm();
  }

  // Save entire section into a form
  commitSection() {
    console.log(`Gonna commit section [${this.currentSection}] with meta ${JSON.stringify(this.sectionMeta)}`);
    this.config = _.merge(
      this.config,
      _.set({}, this.currentSection, {
        sectionMeta: this.sectionMeta,
        fields: this.sectionFields
      })
    );
    console.log('section config', this.config);
    // Check if current section in Form Template file is a table
    if (_.indexOf(['datatable', 'repeat', 'accordion'], _.get(this.config, [this.currentSection, 'sectionMeta', 'type'])) > -1) {
      console.log('Found a repeat section', this.currentSection);
      // + Map the fields to put their jsonMeta and types
      _.set(
        this.config,
        [this.currentSection, 'fieldArray', 'fieldGroup'],
        _.map(this.sectionFields, (fv, fk) =>
          _.merge({ key: fv.key, type: 'input', templateOptions: { description: fv.comment, label: fv.key } }, fv.jsonMeta)
        )
      );
      // + Remove its fields
      _.unset(this.config, [this.currentSection, 'fields']);
      this.arraySections.push(this.currentSection);
    }
  }

  renderForm() {
    // Render the form field based on loaded INI files
    this.fields = _.map(this.config, (sv, sk) =>
      _.merge(
        {
          key: sk,
          wrappers: ['card'],
          templateOptions: {
            label: sk
          },
          fieldGroup: _.map(sv.fields, (fv, fk) =>
            _.merge(
              {
                key: fv.key,
                type: 'input',
                templateOptions: {
                  description: fv.comment,
                  label: fv.key
                }
              },
              fv.jsonMeta
            )
          ),
          fieldArray: sv.fieldArray
        },
        sv.sectionMeta
      )
    );
    console.log('section field', this.fields);
  }
}
