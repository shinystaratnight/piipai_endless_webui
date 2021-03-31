import { Endpoints, Models } from '../enums';
import { Model } from './model';

export class TimesheetModel extends Model {
  readonly key = Models.Timesheet;
  readonly label = 'Timesheet';
  readonly endpoint = Endpoints.Timesheet;
}
