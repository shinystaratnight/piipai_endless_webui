export const List = 'list';

export interface ListElementTemplateOptions {
  label: string;
  text?: string;
  add_label?: string;
}

export class ListElement {
  type = List;

  templateOptions: ListElementTemplateOptions;
  endpoint: string;

  help?: string;
  prefilled?: { [key: string]: string };
  query?: { [key: string]: any };
  metadata_query?: { [key: string]: any };

  constructor(label: string, endpoint: string) {
    this.templateOptions = {
      label
    };

    this.endpoint = endpoint;
  }

  setAdditionalInfo(text: string, help: string) {
    this.templateOptions.text = text;
    this.help = help;

    return this;
  }

  setPrefilledFields(config: { [key: string]: string }) {
    this.prefilled = { ...config };

    return this;
  }

  setQuery(query: { [key: string]: any }) {
    this.query = { ...query };

    return this;
  }

  setMetadataQuery(metadata_query: { [key: string]: any }) {
    this.metadata_query = { ...metadata_query };

    return this;
  }

  withoutAddButton() {
    this.templateOptions.add_label = '';

    return this;
  }

}
