import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';
import { Icon, IconSize } from '../../enums';

@Component({
  selector: 'webui-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnInit {
  @Input() icon?: Icon;
  @Input() size?: IconSize;

  public Icon = Icon;
  public classes?: { [cssClasses: string]: boolean };

  public ngOnInit() {
    this.classes = {
      'size-lg': IconSize.Large === this.size,
      'size-md': IconSize.Medium === this.size,
      'size-xl': IconSize.ExtraLarge === this.size,
    };
  }
}
