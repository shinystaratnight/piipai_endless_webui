import { RelatedElement } from '@webui/metadata';
import { Endpoints } from "../enums";

export interface IModel {
  readonly key: string;
  readonly label: string;
  readonly endpoint: Endpoints;
  formElement(): RelatedElement;
}
