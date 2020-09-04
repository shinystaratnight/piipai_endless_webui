import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams
} from '@ngx-translate/core';
// import { ActivatedRoute } from '@angular/router';

export class MissingTranslationHelper implements MissingTranslationHandler {

  // constructor(private route: ActivatedRoute) {}

  handle(params: MissingTranslationHandlerParams) {
    // const isManager = (<any>this.route.snapshot)._routerState.url.includes('/mn/');
    // if (isManager && params.interpolateParams) {
    //   return params.interpolateParams['Default'];
    // }

    // console.log(params);

    if (params.interpolateParams) {
      return params.interpolateParams['Default'];
    }
    return params.key;
  }
}
