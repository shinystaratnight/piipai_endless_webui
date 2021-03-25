import { Endpoints, Models } from '../enums';
import { Model } from './model';

export class UnitOfMeasurementsModel extends Model {
  readonly endpoint = Endpoints.UnitOfMeasurements;
  readonly label = 'Unit of measurements';
  readonly key = Models.UnitOfMeasurements;
}

