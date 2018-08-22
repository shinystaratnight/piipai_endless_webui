import { Component } from '@angular/core';

@Component({
  selector: 'list-available',
  templateUrl: './list-available.component.html',
  styleUrls: ['./list-available.component.scss']
})
export class ListAvailableComponent {
  public config: any;
  public colors = {
    'All shifts': 'success',
    'Available shifts': 'success-blur',
    'Unavailable shifts': 'danger',
    'Unknown shifts': 'description',
  };

  public getClass(text: string): string {
    return this.colors[text];
  }
}
