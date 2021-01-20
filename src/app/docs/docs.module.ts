import { NgModule } from '@angular/core';
import { SharedCommonModule } from 'app/common/common.module';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { DocsComponent } from './docs.component';
import { DOCS_ROUTES } from './docs.route';

@NgModule({
  imports: [
    SharedCommonModule,
    MarkdownModule.forRoot(),
    RouterModule.forChild(DOCS_ROUTES)
  ],
  declarations: [DocsComponent]
})
export class DocsModule { }
