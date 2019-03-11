export interface Plan {
  id?: number;
  type?: string;
  save?: boolean;
  pay?: number;
  active?: boolean;
  status?: string;
  worker_count?: number;
  procent?: number;
  changed?: any;

  start_range_price_annual?: number;
  start_range_price_monthly?: number;
  start_range?: number;
  step_change_val?: number;
  amount_tag_line?: string;
  table_text?: string;
  table?: string[];
}
