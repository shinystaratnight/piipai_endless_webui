import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { WorkflowService } from '../../services';
import { config, workflowEl } from './workflow.config';
import { getElementFromMetadata } from '../../helpers';

@Component({
  selector: 'webui-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent implements OnInit, OnDestroy {
  public currentWorkflowNodes!: any[];

  public modalRef!: NgbModalRef;

  public modalInfo: any;
  public editModalInfo: any;

  public saveProcess!: boolean;

  public workflowId!: string;
  public parentId?: string;

  public subStates: any;
  public acceptanceTests: any;

  public addConfig!: any[];
  public config!: any[];

  public form: FormGroup = new FormGroup({});
  public formSubscription!: Subscription;

  @Input() public company!: string;
  @Input() public advanced!: boolean;
  @Output() public changeSaving: EventEmitter<any> = new EventEmitter();

  @ViewChild('modal') public modal!: TemplateRef<any>;
  @ViewChild('add') public addModal!: TemplateRef<any>;
  @ViewChild('edit') public editModal!: TemplateRef<any>;
  @ViewChild('tests') public testModal!: TemplateRef<any>;

  constructor(private workflowService: WorkflowService, private modalService: NgbModal) {}

  public ngOnInit() {
    this.subStates = {};
    this.acceptanceTests = {};

    this.getWorkflows();
    this.formSubscription = this.form.valueChanges.subscribe((value) => {
      const { workflow, advance_state_saving } = value;

      if (workflow !== this.workflowId && workflow) {
        this.workflowId = workflow;
        this.getNodes(this.workflowId);
      }

      this.changeSaving.emit({ advance_state_saving });
    });
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }

    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.currentWorkflowNodes, event.previousIndex, event.currentIndex);

    const states = this.currentWorkflowNodes;
    const requests: any[] = [];
    states.forEach((state, i) => {
      const body = {
        order: i,
      };

      requests.push(this.workflowService.updateStateOrder(body, state.id));
    });

    forkJoin(requests).subscribe();
  }

  public getWorkflows() {
    this.workflowService.getWorkflowList().subscribe((res: any) => {
      const { results } = res;
      const options = results.length
        ? results.map((el: any) => {
            const { id, name } = el;

            return {
              value: id,
              label: name,
            };
          })
        : [];

      workflowEl.updateTemplate({ options });
      if (this.advanced) {
        const saving: any = getElementFromMetadata(config, 'advance_state_saving');
        saving.value = true;
      }
      this.config = config;
    });
  }

  public getNodes(id: string) {
    this.workflowService
      .getNodesOfCompany(id, this.company)
      .subscribe((res: any) => (this.currentWorkflowNodes = res.results.sort((p: any, n: any) => (p.order > n.order ? 1 : -1))));
  }

  public getSubstates(workflowId: string, nodeId?: string) {
    if (!nodeId) {
      return;
    }

    this.workflowService
      .getSubStates(workflowId, nodeId)
      .subscribe((res: any) => (this.subStates[nodeId] = res.results));
  }

  public getAcceptensTests(id: string) {
    this.workflowService.getAcceptenceTets(id).subscribe((res: any) => {
      this.acceptanceTests[id] = res.results;
    });
  }

  public addState(e: MouseEvent, parent?: string) {
    e.preventDefault();
    e.stopPropagation();

    if (parent) {
      this.parentId = parent;
    } else {
      this.parentId = undefined;
    }

    this.addConfig = this.getAddConfig(this.company, this.workflowId);

    this.modalRef = this.modalService.open(this.addModal, { windowClass: 'visible-mode', backdrop: 'static' });
  }

  public addStateToCompany(data: any, closeModal: any) {
    closeModal();
    if (data.workflow_node && data.workflow_node.id) {
      data.company = {
        id: this.company,
      };

      if (this.parentId) {
        this.addSubstateToCompany(this.parentId, data);
      } else {
        this.setState(data);
      }
    }
  }

  public setState(data: any, parentId?: string) {
    data.order = this.getNextOrder();

    this.workflowService.addWorkflowToCompany(data).subscribe((res) => {
      if (parentId) {
        this.getSubstates(this.workflowId, parentId);
      } else {
        this.getNodes(this.workflowId);
      }
    });
  }

  public getNextOrder(): number {
    let order = 0;

    this.currentWorkflowNodes.forEach((el) => {
      if (el.order > order) {
        order = el.order;
      }
    });

    const length = this.currentWorkflowNodes.length;
    if (length > order) {
      order = length;
    }

    return order;
  }

  public addSubstateToCompany(parentId: string, data: any) {
    this.workflowService.setParentForSubstate(data.workflow_node.id, parentId).subscribe(() => {
      this.setState(data, parentId);
    });
  }

  public addAcceptenceTest(data: any, closeModal: any) {
    closeModal();

    this.workflowService.addAcceptenceTest(data).subscribe((res: any) => {
      this.getAcceptensTests(res.company_workflow_node);
    });
  }

  public addSubstate(e: MouseEvent, node: any) {
    const parent = node.workflow_node.id;

    this.addState(e, parent);
  }

  public addTest(e: MouseEvent, node: any) {
    e.preventDefault();
    e.stopPropagation();

    this.addConfig = this.getAcceptenceTestsConfig(node);

    this.modalRef = this.modalService.open(this.testModal, { windowClass: 'visible-mode', backdrop: 'static' });
  }

  public openEditModal(node: any, closeModal: any) {
    closeModal();

    this.openState(node, undefined, { size: 'lg' }, 'edit');
  }

  public openState(node: any, closeModal?: any, options?: any, type?: string) {
    if (closeModal) {
      closeModal();
    }

    let modal = this.modal;

    if (type === 'edit') {
      this.editModalInfo = this.generateConfigForEditModal(node);
      modal = this.editModal;
    } else {
      this.modalInfo = this.generateConfigForModal(node);

      this.getSubstates(this.workflowId, node.workflow_node.id);
      this.getAcceptensTests(node.id);
    }

    this.modalRef = this.modalService.open(modal, { ...options, backdrop: 'static' });
  }

  public deleteNode(id: string, e?: MouseEvent) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.workflowService.deleteNode(id).subscribe((res) => {
      this.getNodes(this.workflowId);
    });
  }

  public deleteTest(test: any, node: any) {
    this.workflowService.deleteTest(test.id).subscribe((res) => {
      this.getAcceptensTests(node.id);
    });
  }

  public deleteSubstate(node: any, e?: MouseEvent) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.workflowService.deleteParentForSubstate(node.workflow_node.id).subscribe(() => {
      this.workflowService.deleteNode(node.id).subscribe(() => {
        this.getSubstates(this.workflowId, this.parentId);
      });
    });
  }

  public formEvent(e: any, closeModal: () => void) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }
    if (e.type === 'sendForm' && e.status === 'success') {
      this.saveProcess = false;
      closeModal();
    }
  }

  public formError() {
    this.saveProcess = false;
  }

  public generateConfigForEditModal(node: any) {
    return {
      id: node.workflow_node.id,
      label: node.workflow_node.name_before_activation,
      endpoint: this.workflowService.workflowNodeEndpoint,
      data: {
        company: {
          action: 'add',
          data: {
            hide: true,
            value: {
              id: this.company,
            },
          },
        },
        workflow: {
          action: 'add',
          data: {
            hide: true,
          },
        },
      },
    };
  }

  public generateConfigForModal(node: any) {
    return {
      id: node.workflow_node.id,
      label: node.workflow_node.name_before_activation,
      endpoint: this.workflowService.workflowNodeEndpoint,
      nodeId: node.id,
      node,
    };
  }

  public getAddConfig(company: string, workflow: string): any[] {
    return [
      {
        type: 'related',
        key: 'workflow_node',
        endpoint: this.workflowService.workflowNodeEndpoint,
        options: [],
        templateOptions: {
          add: true,
          label: 'Workflow Node',
          values: ['__str__'],
        },
        prefilled: {
          workflow,
          company,
        },
        query: {
          company,
          workflow,
          system: 2,
        },
      },
    ];
  }

  public getSubStatesConfig(company: string, workflow: string, parent: string): any[] {
    return [
      {
        many: true,
        type: 'related',
        key: 'workflow_node',
        endpoint: this.workflowService.workflowNodeEndpoint,
        options: [],
        templateOptions: {
          add: true,
          label: 'Workflow Node',
        },
        prefilled: {
          workflow,
          company,
        },
        query: {
          company,
          workflow,
          parent,
          system: 2,
        },
      },
    ];
  }

  public getAcceptenceTestsConfig(node: any) {
    const formData = new BehaviorSubject({ data: {} });

    return [
      {
        type: 'select',
        send: false,
        key: 'test_type',
        formData,
        templateOptions: {
          required: false,
          label: 'Test type',
          options: [
            {
              value: '',
              label: 'All',
            },
            {
              value: 'skill',
              label: 'Skill',
            },
            {
              value: 'tag',
              label: 'Tag',
            },
            {
              value: 'industry',
              label: 'Industry',
            },
          ],
        },
      },
      {
        endpoint: '/acceptance-tests/acceptancetests/',
        read_only: false,
        formData,
        templateOptions: {
          label: 'Acceptance Test',
          add: true,
          values: ['__str__'],
          type: 'related',
        },
        query: {
          type: '{test_type}',
        },
        type: 'related',
        key: 'acceptance_test',
      },
      {
        endpoint: '/core/companyworkflownodes/',
        read_only: false,
        hide: true,
        templateOptions: {
          label: 'Acceptance Test',
          values: ['__str__'],
          type: 'related',
        },
        value: node.id,
        type: 'related',
        key: 'company_workflow_node',
      },
    ];
  }
}
