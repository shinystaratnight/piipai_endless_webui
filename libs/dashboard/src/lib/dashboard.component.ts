import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  widgets = [
    [
      {
        type: 'buttons'
      }
    ],
    [
      {
        type: 'candidate',
        size: 4 / 12
      },
      {
        type: 'calendar',
        size: 8 / 12
      }
    ]
  ];
}
