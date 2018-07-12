import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { WorkflowService } from '../../services';

@Component({
  selector: 'workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {

  public workflowList: any;
  public modalRef: any;
  public modalInfo: any;
  public saveProcess: boolean;
  public workflowId: string;
  public currentWorkflowNodes: any[];
  public addConfig: any[];
  public editType: string;

  @Input() public company: string;

  @ViewChild('modal') public modal: TemplateRef<any>;
  @ViewChild('add') public addModal: TemplateRef<any>;

  constructor(
    private workflowService: WorkflowService,
    private modalService: NgbModal,
  ) {}

  public ngOnInit() {
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

    console.log(this);
  }

  public getNodes(id: string) {
    this.workflowService.getNodesOfCompany(id, this.company)
      .subscribe((res) => this.currentWorkflowNodes = res.results);
  }

  public addState() {
    this.addConfig = this.getAddConfig(this.company, this.workflowId);

    this.modalRef = this.modalService.open(this.addModal);
  }

  public addStateToCompany(data: any, closeModal) {
    closeModal();
    if (data.workflow_node && data.workflow_node.id) {
      data.company = {
        id: this.company
      };

      this.workflowService.addWorkflowToCompany(data)
        .subscribe((res) => {
          this.getNodes(this.workflowId);
        });
    }
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
          label: 'Workflow Node'
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

  public openState(node) {
    this.modalInfo = {};
    this.modalInfo.endpoint = this.workflowService.workflowNodeEndpoint;
    this.modalInfo.nodeId = node.id;
    this.modalInfo.id = node.workflow_node.id;
    this.modalInfo.label = node.workflow_node.name_before_activation;
    this.modalInfo.data = {
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
    };

    this.editType = 'info';

    this.modalRef = this.modalService.open(this.modal, { size: 'lg' });
  }

  public deleteNode(id, closeModal) {
    closeModal();
    this.workflowService.deleteNode(id)
      .subscribe((res) => {
        this.getNodes(this.workflowId);
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
    console.log(e);
  }
}
