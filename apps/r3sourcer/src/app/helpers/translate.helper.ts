import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
} from '@ngx-translate/core';

export class MissingTranslationHelper implements MissingTranslationHandler {
  private defaultKey = 'Default';

  handle(params: MissingTranslationHandlerParams) {
    const { key, interpolateParams = {} as any } = params;

    // console.log(`"${key}": "${interpolateParams[this.defaultKey]}"`);

    if (interpolateParams && this.defaultKey in interpolateParams) {
      return (interpolateParams as any)[this.defaultKey];
    }
    return key;
  }
}
