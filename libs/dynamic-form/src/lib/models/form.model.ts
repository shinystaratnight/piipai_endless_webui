import { BehaviorSubject } from 'rxjs';

let counter = 0;

export class Form {

  public allowMethods: string[];
  public hasTabs: boolean;
  public hideEditButton: boolean;
  public disableSaveButton = false;

  private _mode: BehaviorSubject<string>;
  get mode() {
    return this._mode.asObservable();
  }

  private _saveProcess: BehaviorSubject<boolean>;
  get saveProcess() {
    return this._saveProcess.asObservable();
  }

  private _id = counter++;
  get id() {
    return this._id;
  }

  public endpoint: string;

  constructor(endpoint: string, mode: string, allowMethods: string[]) {
    this._mode = new BehaviorSubject(mode);
    this._saveProcess = new BehaviorSubject(false);
    this.endpoint = endpoint;
    this.allowMethods = allowMethods;
  }

  public changeMode(mode: string) {
    this._mode.next(mode);
  }

  public setSaveProcess(saving: boolean) {
    this._saveProcess.next(saving);
  }
}
