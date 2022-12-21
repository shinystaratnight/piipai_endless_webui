import { Component, Input } from '@angular/core';

@Component({
  selector: 'webui-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})

export class SpinnerComponent {
  @Input() sm?: boolean;
}
