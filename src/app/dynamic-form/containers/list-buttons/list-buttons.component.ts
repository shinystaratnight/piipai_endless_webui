import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

interface Button {
  label: string;
  endpoint: string;
  action: string;
}

@Component({
  selector: 'list-buttons',
  templateUrl: 'list-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListButtonsComponent {

  @Input()
  public buttons: Button[];

  @Input()
  public first: boolean;

  @Input()
  public inForm: boolean;

  @Input()
  public label: string;

  @Input()
  public poped: boolean;

  @Input() public allowPermissions: string[];

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public buttonAction(type) {
    this.event.emit({
      type
    });
  }

  public checkPermission(type: string): boolean {
    return this.allowPermissions.indexOf(type) > -1;
  }
}
