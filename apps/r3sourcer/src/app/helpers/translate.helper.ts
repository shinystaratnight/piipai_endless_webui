import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
} from '@ngx-translate/core';

export class MissingTranslationHelper implements MissingTranslationHandler {
  private defaultKey = 'Default';

  handle(params: MissingTranslationHandlerParams) {
    const { key, interpolateParams } = params;

    // console.log(`"${key}": "${interpolateParams[this.defaultKey]}"`);

    if (interpolateParams && this.defaultKey in interpolateParams) {
      return interpolateParams[this.defaultKey];
    }
    return key;
  }
}
