import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams
} from '@ngx-translate/core';

export class MissingTranslationHelper implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.log(params);
    if (params.interpolateParams) {
      return params.interpolateParams['Default'];
    }
    return params.key;
  }
}
