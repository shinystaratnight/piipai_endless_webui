import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChildren,
  TemplateRef,
  ViewChild,
  QueryList,
  ViewContainerRef,
  OnInit
} from '@angular/core';
import { Icon, IconSize } from '../icon.enum';

@Component({
  selector: 'webui-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements OnInit {
  @Input() icon?: Icon;
  @Input() size?: IconSize;
  @ViewChildren('icon', { read: TemplateRef }) icons?: QueryList<TemplateRef<SVGElement>>;
  @ViewChild('view', { read: ViewContainerRef }) view?: ViewContainerRef;
  Icon = Icon;
  public classes?: { [cssClasses: string]: boolean };

  public ngOnInit() {
    this.classes = {
      'size-lg': IconSize.Large === this.size,
      'size-md': IconSize.Medium === this.size,
      'size-xl': IconSize.ExtraLarge === this.size
    };
  }
}
