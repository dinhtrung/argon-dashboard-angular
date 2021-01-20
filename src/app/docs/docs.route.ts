import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import * as _ from 'lodash';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { createRequestOption } from 'app/shared/util/request-util';
import { BUILD_TIMESTAMP } from 'app/app.constants';
import { DocsComponent } from './docs.component';

@Injectable({ providedIn: 'root' })
export class DocFileResolve implements Resolve<string> {
  constructor(private service: HttpClient) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    return this.service
      .get(route.queryParams.p || `assets/docs/${route.params.doc || 'index'}.md`, {
        params: createRequestOption({ ts: BUILD_TIMESTAMP }),
        responseType: 'text',
        observe: 'response'
      })
      .pipe(
        filter((response: HttpResponse<string>) => response.ok),
        map((content: HttpResponse<string>) => content.body)
      );
  }
}

export const DOCS_ROUTES: Routes = [
  {
    path: '',
    component: DocsComponent,
    resolve: {
      doc: DocFileResolve
    },
    data: {
      authorities: [],
      pageTitle: 'home.title'
    }
  },
  {
    path: ':doc',
    component: DocsComponent,
    resolve: {
      doc: DocFileResolve
    },
    data: {
      authorities: [],
      pageTitle: 'home.title'
    }
  }
];
