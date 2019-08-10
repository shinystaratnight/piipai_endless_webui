import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';

import { WorkflowService } from '../../services';
import { config, workflowEl } from './workflow.config';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit, OnDestroy {

  public currentWorkflowNodes: any[];

  public modalRef: NgbModalRef;

  public modalInfo: any;
  public editModalInfo: any;

  public saveProcess: boolean;

  public workflowId: string;
  public parentId: string;

  public subStates: any;
  public acceptanceTests: any;

  public addConfig: any[];
  public config: any[];

  public form: FormGroup = new FormGroup({});
  public formSubscription: Subscription;

  @Input() public company: string;
  @Input() public advanced: boolean;
  @Output() public changeSaving: EventEmitter<any> = new EventEmitter();

  @ViewChild('modal', { static: false }) public modal: TemplateRef<any>;
  @ViewChild('add', { static: false }) public addModal: TemplateRef<any>;
  @ViewChild('edit', { static: false }) public editModal: TemplateRef<any>;
  @ViewChild('tests', { static: false }) public testModal: TemplateRef<any>;

  constructor(
    private workflowService: WorkflowService,
    private modalService: NgbModal,
  ) { }

  public ngOnInit() {
    this.subStates = {};
    this.acceptanceTests = {};

    this.getWorkflows();
    this.formSubscription = this.form.valueChanges
      .subscribe((value) => {
        const { workflow, advance_state_saving } = value;

        if ((workflow !== this.workflowId) && workflow) {
          this.workflowId = workflow;
          this.getNodes(this.workflowId);
        }

        this.changeSaving.emit(advance_state_saving);
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

  public onDrop() {
    const states = this.currentWorkflowNodes;

    const requests = [];
    states.forEach((state, i) => {
      const body = {
        order: i
      };

      requests.push(this.workflowService.updateStateOrder(body, state.id));
    });

    forkJoin(requests).subscribe();
  }

  public getWorkflows() {
    this.workflowService.getWorkflowList()
      .subscribe((res: any) => {
        const { results } = res;
        const options = results.length
          ? results.map((el) => {
            const { id, name } = el;

            return {
              value: id,
              label: name
            };
          })
          : [];

        workflowEl.updateTemplate({ options });
        this.config = config;
      });
  }

  public getNodes(id: string) {
    this.workflowService.getNodesOfCompany(id, this.company)
      .subscribe((res: any) => this.currentWorkflowNodes = res.results);
  }

  public getSubstates(workflowId: string, nodeId: string) {
    this.workflowService.getSubStates(workflowId, nodeId)
      .subscribe((res: any) => this.subStates[nodeId] = res.results);
  }

  public getAcceptensTests(id: string) {
    this.workflowService.getAcceptenceTets(id)
      .subscribe((res: any) => {
        this.acceptanceTests[id] = res.results;
      });
  }

  public addState(e, parent: string) {
    e.preventDefault();
    e.stopPropagation();

    if (parent) {
      this.parentId = parent;
    } else {
      this.parentId = undefined;
    }

    this.addConfig = this.getAddConfig(this.company, this.workflowId);

    this.modalRef = this.modalService.open(this.addModal, { windowClass: 'visible-mode' });
  }

  public addStateToCompany(data: any, closeModal) {
    closeModal();
    if (data.workflow_node && data.workflow_node.id) {
      data.company = {
        id: this.company
      };

      if (this.parentId) {
        this.addSubstateToCompany(this.parentId, data);
      } else {
        this.setState(data);
      }
    }
  }

  public setState(data, parentId?: string) {
    data.order = this.getNextOrder();

    this.workflowService.addWorkflowToCompany(data)
      .subscribe((res) => {
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

  public addSubstateToCompany(parentId: string, data) {
    this.workflowService.setParentForSubstate(data.workflow_node.id, parentId)
      .subscribe(() => {
        this.setState(data, parentId);
      });
  }

  public addAcceptenceTest(data, closeModal) {
    closeModal();

    this.workflowService.addAcceptenceTest(data)
      .subscribe((res: any) => {
        this.getAcceptensTests(res.company_workflow_node);
      });
  }

  public addSubstate(e, node) {
    const parent = node.workflow_node.id;

    this.addState(e, parent);
  }

  public addTest(e, node) {
    e.preventDefault();
    e.stopPropagation();

    this.addConfig = this.getAcceptenceTestsConfig(node);

    this.modalRef = this.modalService.open(this.testModal, { windowClass: 'visible-mode' });
  }

  public openEditModal(node, closeModal) {
    closeModal();

    this.openState(node, undefined, { size: 'lg' }, 'edit');
  }

  public openState(node, closeModal, options?, type?: string) {
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

    this.modalRef = this.modalService.open(modal, options);
  }

  public deleteNode(id, e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.workflowService.deleteNode(id)
      .subscribe((res) => {
        this.getNodes(this.workflowId);
      });
  }

  public deleteTest(test, node) {
    this.workflowService.deleteTest(test.id)
      .subscribe((res) => {
        this.getAcceptensTests(node.id);
      });
  }

  public deleteSubstate(node, e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.workflowService.deleteParentForSubstate(node.workflow_node.id)
      .subscribe(() => {
        this.workflowService.deleteNode(node.id)
          .subscribe(() => {
            this.getSubstates(this.workflowId, this.parentId);
          });
      });
  }

  public formEvent(e, closeModal) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }
    if (e.type === 'sendForm' && e.status === 'success') {
      this.saveProcess = false;
      closeModal();
    }
  }

  public formError(e) {
    this.saveProcess = false;
  }

  public generateConfigForEditModal(node) {
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
              id: this.company
            }
          }
        },
        workflow: {
          action: 'add',
          data: {
            hide: true
          }
        }
      }
    };
  }

  public generateConfigForModal(node) {
    return {
      id: node.workflow_node.id,
      label: node.workflow_node.name_before_activation,
      endpoint: this.workflowService.workflowNodeEndpoint,
      nodeId: node.id,
      node
    };
  }

  public getAddConfig(company, workflow): any[] {
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
          company
        },
        query: {
          company,
          workflow,
          system: 2,
          hardlock: 'False'
        }
      }
    ];
  }

  public getSubStatesConfig(company, workflow, parent): any[] {
    return [
      {
        many: true,
        type: 'related',
        key: 'workflow_node',
        endpoint: this.workflowService.workflowNodeEndpoint,
        options: [],
        templateOptions: {
          add: true,
          label: 'Workflow Node'
        },
        prefilled: {
          workflow,
          company
        },
        query: {
          company,
          workflow,
          parent,
          system: 2
        }
      }
    ];
  }

  public getAcceptenceTestsConfig(node) {
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
              label: 'All'
            },
            {
              value: 'skill',
              label: 'Skill'
            },
            {
              value: 'tag',
              label: 'Tag'
            },
            {
              value: 'industry',
              label: 'Industry'
            },
          ]
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
          type: '{test_type}'
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
      }
    ];
  }
}
