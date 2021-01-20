import { Route } from '@angular/router';

import { DemoComponent } from './demo.component';
import { JhiResolvePagingParams } from 'ng-jhipster';

export const DEMO_ROUTE: Route = {
  path: '',
  component: DemoComponent,
  data: {
    authorities: [],
    pageTitle: 'demo.title'
  },
  resolve: {
    pagingParams: JhiResolvePagingParams
  }
};
