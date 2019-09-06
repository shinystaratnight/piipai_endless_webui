import { Subject } from 'rxjs';

export enum EventType {
  PurposeChanged,
  Logout,
  RoleChanged
}

export class EventService {
  get event$() {
    return this.event.asObservable();
  }

  private event = new Subject<EventType>();

  emit(type: EventType) {
    this.event.next(type);
  }
}
