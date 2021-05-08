import { BehaviorSubject, Subject } from 'rxjs';

export interface IFormErrors {
  non_field_errors?: string | string[];
  detail?: string;
  [key: string]: string | string[];
}

let counter = 0;

export class Form {
  private _errors: Subject<IFormErrors> = new Subject();
  private _mode: BehaviorSubject<string>;
  private _saveProcess: BehaviorSubject<boolean>;
  private _id = counter++;
  private _initialData: { [key: string]: any };

  public allowMethods: string[];
  public hasTabs: boolean;
  public hideEditButton: boolean;
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
    return {...this._initialData};
  }

  public endpoint: string;

  constructor(endpoint: string, mode: string, allowMethods: string[]) {
    this._mode = new BehaviorSubject(mode);
    this._saveProcess = new BehaviorSubject(false);
    this.endpoint = endpoint;
    this.allowMethods = allowMethods;
  }

  public changeMode(mode: string): void {
    this._mode.next(mode);
  }

  public setSaveProcess(saving: boolean): void {
    this._saveProcess.next(saving);
  }

  public setErrors(errors: IFormErrors): void {
    this._errors.next(errors);
  }

  public setInitialData(data: any) {
    this._initialData = data;
  }
}
