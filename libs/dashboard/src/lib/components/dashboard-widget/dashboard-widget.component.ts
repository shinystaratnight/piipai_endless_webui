import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Label } from '@webui/core';

@Component({
  selector: 'webui-dashboard-widget',
  templateUrl: './dashboard-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardWidgetComponent {
  @Input() label!: Label;
}
