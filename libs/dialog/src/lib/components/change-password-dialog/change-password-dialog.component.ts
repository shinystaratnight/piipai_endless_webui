import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'webui-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
