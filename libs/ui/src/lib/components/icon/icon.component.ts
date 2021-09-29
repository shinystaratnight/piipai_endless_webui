import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  @Input() icon: string;

  get svgId(): string {
    return `#icon-${this.icon}`;
  }
}
