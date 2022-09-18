import { DateFormatPipe } from './date-format.pipe';
import { AverageScorePipe } from './average-score.pipe';
import { WorkflowStatePipe } from './workflow-state.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';

export * from './date-format.pipe';
export * from './average-score.pipe';
export * from './safe-html.pipe';

export const pipes = [
  DateFormatPipe,
  AverageScorePipe,
  WorkflowStatePipe,
  SafeHtmlPipe
];
