import { DateFormatPipe } from './date-format.pipe';
import { AverageScorePipe } from './average-score.pipe';
import { WorkflowStatePipe } from './workflow-state.pipe';

export * from './date-format.pipe';
export * from './average-score.pipe';

export const pipes = [
  DateFormatPipe,
  AverageScorePipe,
  WorkflowStatePipe
];
