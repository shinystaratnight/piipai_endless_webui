interface IRelatedObject {
  id?: string;
  __str__?: string;
}

export class DropdownOption {
  static fromRelatedObject(object: IRelatedObject): DropdownOption {
    return new DropdownOption(object.__str__, object.id);
  }

  constructor(public label: string = '', public value: string = '') {}
}

interface IDropdownPayload {
  fetching: boolean;
  results: DropdownOption[] | undefined;
  error: string | null;
}

export class DropdownPayload implements IDropdownPayload {
  fetching: boolean;
  results: DropdownOption[] | undefined;
  error: string | null;

  constructor(config: IDropdownPayload) {
    this.results = config.results;
    this.fetching = config.fetching;
    this.error = config.error || '';
  }

  static initialState() {
    return new DropdownPayload({
      fetching: true,
      results: undefined,
      error: null
    });
  }

  static downloadMoreState(results: DropdownOption[]) {
    return new DropdownPayload({
      fetching: true,
      results,
      error: null
    });
  }

  static successState(results: DropdownOption[]) {
    return new DropdownPayload({
      fetching: false,
      results,
      error: null
    });
  }

  static errorState(error: string) {
    return new DropdownPayload({
      fetching: false,
      results: undefined,
      error
    });
  }
}
