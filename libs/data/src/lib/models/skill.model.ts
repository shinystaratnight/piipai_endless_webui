import { Endpoints, Models } from '../enums';
import { Model } from './model';

export class SkillModel extends Model {
  readonly endpoint = Endpoints.Skill;
  readonly label = 'Skill';
  readonly key = Models.Skill;
}
