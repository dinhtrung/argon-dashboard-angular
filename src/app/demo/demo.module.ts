import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedCommonModule } from 'app/common/common.module';
import { DEMO_ROUTE } from './demo.route';
import { DemoComponent } from './demo.component';
import { NgxFormlyComponent } from './ngx-formly/ngx-formly.component';
import { JsYamlComponent } from './js-yaml/js-yaml.component';
import { FormDesignerComponent } from './form-designer/form-designer.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FormJsonComponent } from './form-json/form-json.component';

@NgModule({
  imports: [SharedCommonModule, RouterModule.forChild([DEMO_ROUTE])],
  declarations: [
    DemoComponent,
    NgxFormlyComponent,
    JsYamlComponent,
    FormDesignerComponent,
    FormJsonComponent,
    FormBuilderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DemoModule {}
