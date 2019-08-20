let counter = 0;

export class List {
  private _id = counter++;
  get id() {
    return this._id;
  }

}
