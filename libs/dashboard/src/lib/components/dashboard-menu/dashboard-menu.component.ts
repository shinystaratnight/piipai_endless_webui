import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface WidgetItem {
  widgetId: string;
  id?: string;
  name: string;
  active: boolean;
  translateKey: string;
}

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardMenuComponent implements OnInit, OnChanges, OnDestroy {

  @Input() widgets: WidgetItem[];
  @Output() changed: EventEmitter<WidgetItem> = new EventEmitter();

  form: FormGroup;
  private subscription: Subscription;

  ngOnInit() {
    this.updateForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['widgets'].isFirstChange()) {
      this.updateForm();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateForm() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const form = {};
    this.widgets.forEach(widget => {
      form[widget.widgetId] = new FormControl(widget.active)
    });

    this.form = new FormGroup(form);
    this.subscription = this.form.valueChanges.subscribe(value => {
      const changedWidget = this.widgets.find(widget => value[widget.widgetId] !== widget.active);

      if (changedWidget) {
        this.changed.emit({...changedWidget, active: value[changedWidget.widgetId]});
      }
    });
  }
}
