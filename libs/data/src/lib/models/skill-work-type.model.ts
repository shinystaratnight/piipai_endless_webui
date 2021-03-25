import { Endpoints, Models } from '../enums';
import { Model } from './model';

export class SkillWorkTypeModel extends Model {
  readonly key = Models.SkillWorkType;
  readonly label = 'Skill Activity';
  readonly endpoint = Endpoints.SkillWorkTypes;
}
