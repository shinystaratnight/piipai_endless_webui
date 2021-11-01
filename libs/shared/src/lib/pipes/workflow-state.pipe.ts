import { Pipe, PipeTransform, Optional, Inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ENV, LocalEnvService } from '@webui/core';

@Pipe({
  name: 'workflowState'
})
export class WorkflowStatePipe implements PipeTransform {

  constructor(
    private translatePipe: TranslatePipe,
    @Optional() @Inject(ENV) private env: any,
    @Optional() private localEnv: LocalEnvService,
  ) {}

  transform(number: number, ...args: [ string, string ]): string {
    const [ fallback, type ] = args;
    const workflowType = this.localEnv.value['workflowType'];

    if (!workflowType) {
      return this.env.production
        ? fallback
        : 'Workflow type is not provided';
    }

    const translateKey = `workflow.${workflowType}.${number}.${type}`;

    return this.translatePipe.transform(translateKey);
  }

}
