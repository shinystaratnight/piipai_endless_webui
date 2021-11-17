import { Endpoints } from "@webui/data";
import { Form } from "@webui/metadata";

export const paymentMetadata = [
  new Form.list.element('Payments', Endpoints.Payments, 'payments')
    .withoutAddButton()
];

export const smsMetadata = [
  new Form.list.element('SMS logs', Endpoints.SmsLog, 'sms_logs')
];
