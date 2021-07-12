import { Form } from '@webui/metadata';
import { Endpoints, Models } from '../enums';
import { IModel, OverrideConfig } from '../interfaces';

export abstract class Model implements IModel {
  readonly key: Models;
  readonly label: string;
  readonly endpoint: Endpoints;
  readonly translateKey: string;

  constructor(readonly data = {}) {}

  formElement(config = {} as OverrideConfig) {
    const { key, label } = config;

    return new Form.related.element(
      key || this.key,
      label || this.label,
      this.endpoint
    );
  }

  protected _formListElement(config = {} as OverrideConfig) {
    const { label } = config;

    return new Form.list.element(
      label || this.label,
      this.endpoint,
      this.translateKey
    );
  }
}
