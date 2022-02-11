export type ID = string;

export interface IRelatedModel {
  id: ID;
  __str__: string;
}

export class RelatedModel implements RelatedModel {
  id: ID;
  __str__: string;

  constructor(config: IRelatedModel) {
    this.id = config.id;
    this.__str__ = config.__str__;
  }
}

export interface IBasic {
  id?: ID;
  updated_at?: string;
  created_at?: string;
}

export class Basic implements IBasic {
  id?: ID;
  updated_at?: string;
  created_at?: string;

  constructor(config: IBasic) {
    this.id = config.id;
    this.created_at = config.created_at;
    this.updated_at = config.updated_at;
  }

  public getPartialValue<T>(props: Array<keyof T>): Partial<T> {
    const result = {};

    props.forEach((prop) => {
      const key = prop.toString();

      result[key] = this[key];
    });

    return result;
  }
}
