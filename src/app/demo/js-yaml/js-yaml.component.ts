import { Component, OnInit } from '@angular/core';
import * as jsyaml from 'js-yaml';

@Component({
  selector: 'jhi-js-yaml',
  templateUrl: './js-yaml.component.html',
  styles: []
})
export class JsYamlComponent implements OnInit {
  modelJson: string;
  modelYaml: string;
  constructor() {}

  ngOnInit() {}

  jsonToYaml() {
    this.modelYaml = jsyaml.dump(JSON.parse(this.modelJson));
  }

  yamlToJson() {
    this.modelJson = JSON.stringify(jsyaml.load(this.modelYaml));
  }
}
