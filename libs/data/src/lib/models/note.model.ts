import { Endpoints, Models } from '../enums';
import { OverrideConfig } from '../interfaces';
import { Model } from './model';

export class NoteModel extends Model {
  readonly key = Models.Note;
  readonly label = 'Notes';
  readonly endpoint = Endpoints.Note;

  formListElement(config?: OverrideConfig) {
    return super
      ._formListElement(config)
      .setQuery({
        object_id: '{id}'
      })
      .setMetadataQuery({
        type: 'timesheet'
      })
      .setPrefilledFields({
        object_id: '{id}',
        contact: '{session.data.contact.id}',
        content_type:
          config && config.model_content_type
            ? config.model_content_type
            : '{model_content_type}'
      })
      .useForm();
  }
}
