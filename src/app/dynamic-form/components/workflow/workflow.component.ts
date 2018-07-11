import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

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
  public currentWorkflow: any;

  @ViewChild('modal') public modal: TemplateRef<any>;

  constructor(
    private workflowService: WorkflowService,
    private modalService: NgbModal,
  ) {}

  public ngOnInit() {
    this.workflowService.getWorkflowList()
      .subscribe((res: any) => {
        const workflowList = {
          keys: []
        };

        workflowList.keys =
          res.results.length
          ? res.results.map((el) => {
            return {
              value: el.id,
              label: el.name
            };
          })
          : [];
        res.results.forEach((el) => {
          workflowList[el.id] = el;
        });

        this.workflowList = workflowList;
      });

    console.log(this);
  }

  public openState(node) {
    this.modalInfo = {};
    this.modalInfo.endpoint = this.workflowService.workflowNodeEndpoint;
    this.modalInfo.id = node.id;
    this.modalInfo.label = node.name_before_activation;

    this.modalRef = this.modalService.open(this.modal, { size: 'lg' });
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
