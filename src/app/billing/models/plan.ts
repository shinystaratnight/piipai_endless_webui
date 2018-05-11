export interface Plan {
  name?: string;
  type?: string;
  description?: string;
  save?: boolean;
  pay?: number;
  price?: number;
  active?: boolean;
  start?: number;
  status?: string;
  worker_count?: number;
}
