import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit
} from '@angular/core';

@Component({
  selector: 'webui-filter-header',
  templateUrl: './filter-header.component.html',
  styleUrls: ['./filter-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterHeaderComponent implements OnInit {
  @Input() label!: string;
  @Input() resetButton!: boolean;
  @Input() key!: string;
  @Output() resetEvent: EventEmitter<void> = new EventEmitter<void>();

  translationKey!: string;

  onReset() {
    this.resetEvent.emit();
  }

  ngOnInit() {
    this.translationKey = `filter.${this.key}.label`;
  }
}
