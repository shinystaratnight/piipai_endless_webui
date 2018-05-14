export interface Plan {
  id: number;
  name?: string;
  type?: string;
  description?: string;
  save?: boolean;
  pay?: number;
  active?: boolean;
  start?: number;
  status?: string;
  worker_count?: number;
  procent?: number;
}
