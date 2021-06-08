import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams
} from '@ngx-translate/core';

export class MissingTranslationHelper implements MissingTranslationHandler {
  private defaultKey = 'Default';

  handle(params: MissingTranslationHandlerParams) {
    console.log(params);

    if (params.interpolateParams) {
      return params.interpolateParams[this.defaultKey];
    }
    return params.key;
  }
}
