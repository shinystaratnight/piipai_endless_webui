import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { CheckPermissionService, SubscriptionService } from '@webui/core';
import { Endpoints } from '@webui/data';

type Action = 'post' | 'update' | 'delete' | 'get';

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective {

  @Input() appHasPermission: {
    action: Action;
    endpoint: Endpoints;
  };
  @Input() endpoint: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private view: ViewContainerRef,
    private permissionService: CheckPermissionService
  ) {}

  ngOnInit() {
    const { action, endpoint } = this.appHasPermission;
    const isAllowed = this.permissionService.hasPermission(action, endpoint);

    if (isAllowed) {
      this.view.createEmbeddedView(this.templateRef);
    }
  }
}
