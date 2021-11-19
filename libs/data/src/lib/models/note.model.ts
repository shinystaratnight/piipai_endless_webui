import { Endpoints, Models } from '../enums';
import { OverrideConfig } from '../interfaces';
import { Model } from './model';

export class NoteModel extends Model {
  readonly key = Models.Note;
  readonly label = 'Notes';
  readonly endpoint = Endpoints.Note;
  readonly translateKey = 'notes';

  formListElement(config: OverrideConfig = {}) {
    const { query, model_content_type } = config;

    return super
      ._formListElement({
        ...config,
      })
      .setQuery({
        object_id: '{id}'
      })
      .setMetadataQuery({
        type: query || 'timesheet'
      })
      .setPrefilledFields({
        object_id: '{id}',
        contact: '{session.data.contact.id}',
        content_type: model_content_type
          ? model_content_type
          : '{model_content_type}'
      })
      .useForm();
  }
}
