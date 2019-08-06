import { workflownodes, workflows } from '@webui/shared-metadata';
import { Endpoints } from '@webui/data';

export class Metadata {
  [Endpoints.WorkflowNode] = workflownodes;
  [Endpoints.Workflow] = workflows;
}
