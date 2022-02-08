import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { IconSize, Icon } from '@webui/icon';

interface ICell {
  content: string;
}

interface IRow {
  cells: ICell[];
  entity?: any;
}

export interface ITable {
  rows: IRow[];
  head: string[];
}

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityListComponent {
  @Input() public config: ITable;

  public readonly Icon = Icon;
  public readonly IconSize = IconSize;

  @Output() public edit: EventEmitter<IRow> = new EventEmitter();
  @Output() public delete: EventEmitter<IRow> = new EventEmitter();

  public onEdit(row: IRow): void {
    this.edit.emit(row);
  }

  public onDelete(row: IRow): void {
    this.delete.emit(row);
  }
}
