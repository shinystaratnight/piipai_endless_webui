import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

export interface UserModelData {
  dashboard_module: string;
  position: number;
  ui_config: any;
}

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('modal')
  public modal: any;

  public userModelsEndpoint = '/ecore/api/v2/endless-core/userdashboardmodules/';
  public modelsListEndpoint = '/ecore/api/v2/endless-core/dashboardmodules/';
  public modalRef: any;
  public userModelData: UserModelData;
  public lastPosition: number = 0;
  public modulesList: any;
  public userModules: any;

  constructor(
    public modalService: NgbModal,
    private genericFormService: GenericFormService
  ) { }

  public ngOnInit() {
    this.getModelsList();
    this.getUserModules();
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public openModal() {
    this.modalRef = this.modalService.open(this.modal, {size: 'lg'});
  }

  public getModelsList() {
    this.genericFormService.getAll(this.modelsListEndpoint).subscribe(
      (res: any) => {
        this.modulesList = res.results;
      }
    );
  }

  public addModule(widget, closeModal) {
    closeModal();
    this.userModelData = {
      dashboard_module: widget.id,
      position: this.lastPosition + 1,
      ui_config: {}
    };
    this.genericFormService.submitForm(this.userModelsEndpoint, this.userModelData).subscribe(
      (res: any) => {
        this.lastPosition += 1;
        this.getUserModules();
      }
    );
  }

  public getUserModules() {
    this.genericFormService.getAll(this.userModelsEndpoint).subscribe(
      (res: any) => {
        this.userModules = res.results;
      }
    );
  }
}
