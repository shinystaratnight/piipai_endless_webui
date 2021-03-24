import { Form } from '@webui/metadata';
import { Endpoints, Models } from '../enums';
import { IModel } from '../interfaces';

export abstract class Model implements IModel {
  readonly key: Models;
  readonly label: string;
  readonly endpoint: Endpoints;

  formElement() {
    return new Form.related.element(this.key, this.label, this.endpoint);
  }
}
