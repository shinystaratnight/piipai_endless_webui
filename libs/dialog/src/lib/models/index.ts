import { DialogType } from '@webui/models';
import {
  ChangeEmailDialogComponent,
  ChangePhoneNumberDialogComponent,
  ConfirmDialogComponent,
} from '../components';

export const dialogMap = new Map<DialogType, unknown>();

dialogMap.set(DialogType.ChangeEmail, ChangeEmailDialogComponent);
dialogMap.set(DialogType.ChangePhoneNumber, ChangePhoneNumberDialogComponent);
dialogMap.set(DialogType.ConfirmAction, ConfirmDialogComponent);
