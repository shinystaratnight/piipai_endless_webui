import { Subject } from 'rxjs';

export enum EventType {
  PurposeChanged,
  Logout,
  RoleChanged,
  CalendarJobSelected,
  RefreshCalendar
}

export class EventService {
  get event$() {
    return this.event.asObservable();
  }
  payload: any;

  private event = new Subject<EventType>();

  emit(type: EventType, payload?: any) {
    this.payload = payload;

    this.event.next(type);
  }
}
