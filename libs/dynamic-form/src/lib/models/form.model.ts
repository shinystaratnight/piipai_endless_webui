import { BehaviorSubject, Subject } from 'rxjs';
import { FormMode } from '../services';

export interface IFormErrors {
  non_field_errors: string | string[];
  detail: string;
  [key: string]: string | string[];
}

let counter = 0;

export class Form {
  private _errors: Subject<IFormErrors> = new Subject();
  private _mode: BehaviorSubject<FormMode>;
  private _saveProcess: BehaviorSubject<boolean>;
  private _id = counter++;
  private _initialData: { [key: string]: any } = {};
  private _additionalData: { [key: string]: any } = {};

  public allowMethods: string[];
  public hasTabs!: boolean;
  public hideEditButton!: boolean;
  public disableSaveButton = false;

  get mode() {
    return this._mode.asObservable();
  }

  get saveProcess() {
    return this._saveProcess.asObservable();
  }

  get id() {
    return this._id;
  }

  get errors$() {
    return this._errors.asObservable();
  }

  get initialData() {
    return { ...this._initialData };
  }

  get additionalData() {
    return { ...this._additionalData };
  }

  public endpoint: string;

  constructor(endpoint: string, mode: FormMode, allowMethods: string[]) {
    this._mode = new BehaviorSubject(mode);
    this._saveProcess = new BehaviorSubject<boolean>(false);
    this.endpoint = endpoint;
    this.allowMethods = allowMethods;
  }

  public changeMode(mode: FormMode): void {
    this._mode.next(mode);
  }

  public setSaveProcess(saving: boolean): void {
    this._saveProcess.next(saving);
  }

  public setErrors(errors: IFormErrors): void {
    this._errors.next(errors);
  }

  public setInitialData(data: any) {
    this._initialData = { ...this._initialData, ...data };
  }

  public updateAdditionalData(key: string, value: any) {
    this._additionalData = {
      ...this._additionalData,
      [key]: value
    }
  }
}
