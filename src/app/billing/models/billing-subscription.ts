export interface BillingSubscription {
  company: string;
  name: string;
  type:	string;
  price:	number;
  worker_count: number;
  created: string;
  active: boolean;
  id: number;
  current_period_start: string;
  current_period_end: string;
}
