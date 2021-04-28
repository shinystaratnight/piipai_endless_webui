import { Form } from '@webui/metadata';
import { Endpoints, Models } from '../enums';
import { IModel, OverrideConfig } from '../interfaces';

export abstract class Model implements IModel {
  readonly key: Models;
  readonly label: string;
  readonly endpoint: Endpoints;

  formElement(config = {} as OverrideConfig) {
    const { key, label } = config;

    return new Form.related.element(
      key || this.key,
      label || this.label,
      this.endpoint
    );
  }
}
