import { Component, Input } from '@angular/core';

@Component({
  selector: 'webui-mobile-timesheets',
  templateUrl: './mobile-timesheets.component.html',
  styleUrls: ['./mobile-timesheets.component.scss']
})
export class MobileTimesheetsComponent {

  @Input()
  public clientId: string;
}
