import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { WorkflowService } from '../../services';

@Component({
  selector: 'workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit, OnDestroy {

  public workflowList: any;
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

  @Input() public company: string;

  @ViewChild('modal') public modal: TemplateRef<any>;
  @ViewChild('add') public addModal: TemplateRef<any>;
  @ViewChild('edit') public editModal: TemplateRef<any>;
  @ViewChild('tests') public testModal: TemplateRef<any>;

  constructor(
    private workflowService: WorkflowService,
    private modalService: NgbModal,
  ) {}

  public ngOnInit() {
    this.subStates = {};
    this.acceptanceTests = {};

    this.getWorkflows();
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public getWorkflows() {
    this.workflowService.getWorkflowList()
      .subscribe((res: any) => {
        this.workflowList =
          res.results.length
          ? res.results.map((el) => {
            return {
              value: el.id,
              label: el.name
            };
          })
          : [];
      });
  }

  public getNodes(id: string) {
    this.workflowService.getNodesOfCompany(id, this.company)
      .subscribe((res) => this.currentWorkflowNodes = res.results);
  }

  public getSubstates(workflowId: string, nodeId: string) {
    this.workflowService.getSubStates(workflowId, nodeId)
      .subscribe((res) => this.subStates[nodeId] = res.results);
  }

  public getAcceptensTests(id: string) {
    this.workflowService.getAcceptenceTets(id)
      .subscribe((res) => {
        this.acceptanceTests[id] = res.results;
      });
  }

  public addState(parent: string) {
    if (parent) {
      this.parentId = parent;
    } else {
      this.parentId = undefined;
    }

    this.addConfig = this.getAddConfig(this.company, this.workflowId);

    this.modalRef = this.modalService.open(this.addModal);
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
    this.workflowService.addWorkflowToCompany(data)
      .subscribe((res) => {
        if (parentId) {
          this.getSubstates(this.workflowId, parentId);
        } else {
          this.getNodes(this.workflowId);
        }
      });
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
      .subscribe((res) => {
        this.getAcceptensTests(res.company_workflow_node);
      });
  }

  public addSubstate(node) {
    const parent = node.workflow_node.id;

    this.addState(parent);
  }

  public addTest(node) {
    this.addConfig = this.getAcceptenceTestsConfig(node);

    this.modalRef = this.modalService.open(this.testModal);
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
          values: ['name_before_activation'],
          display: '{name_before_activation}'
        },
        prefilled: {
          workflow,
          company
        },
        query: {
          company,
          workflow,
          system: 2
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
        endpoint: '/ecore/api/v2/acceptance-tests/acceptancetests/',
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
        endpoint: '/ecore/api/v2/core/companyworkflownodes/',
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
