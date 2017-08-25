import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { NavigationService, Page } from '../../services/navigation.service';

export interface UserModelData {
  dashboard_module: string;
  position: number;
  ui_config: any;
}

export interface WidgetItem {
  label: string;
  link: string;
  endpoint: string;
  position: number;
  ui_config: any;
  labelOfWidgetGroup: string;
  id: string;
}

export interface WidgetGroup {
  label: string;
  list: WidgetItem[];
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
  public modulesList: any;
  public userModules: any;
  public availableModules: any;
  public widgetList: WidgetGroup[];
  public pages: Page[];
  public widgets: WidgetItem[];

  constructor(
    public modalService: NgbModal,
    private genericFormService: GenericFormService,
    private navigationService: NavigationService
  ) { }

  public ngOnInit() {
    this.widgetList = [];
    this.widgets = [];
    this.getPagesList();
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public openModal() {
    this.availableModules = this.getAvaliableModules();
    this.modalRef = this.modalService.open(this.modal);
  }

  public getAvaliableModules() {
    return this.modulesList.filter((el) => {
      let result;
      let exist = this.userModules.filter((elem) => {
        if (elem.dashboard_module.id === el.id) {
          return true;
        }
      });
      if (exist && !exist.length) {
        result = true;
      }
      return result;
    });
  }

  public getModelsList() {
    this.genericFormService.getAll(this.modelsListEndpoint).subscribe(
      (res: any) => {
        this.modulesList = res.results;
        if (this.userModules && this.userModules.length) {
          this.generateWidgetList();
        }
      }
    );
  }

  public addModule(widget, closeModal) {
    closeModal();
    this.userModelData = {
      dashboard_module: widget.id,
      position: this.getLastPosition() + 1,
      ui_config: {}
    };
    this.genericFormService.submitForm(this.userModelsEndpoint, this.userModelData).subscribe(
      (res: any) => {
        this.getUserModules();
      }
    );
  }

  public removeModule(widget) {
    this.genericFormService.delete(this.userModelsEndpoint, widget.id).subscribe(
      (res: any) => {
        this.getUserModules();
    });
  }

  public getUserModules() {
    this.genericFormService.getAll(this.userModelsEndpoint).subscribe(
      (res: any) => {
        this.widgets = [];
        this.widgetList = [];
        this.userModules = res.results;
        if (this.modulesList && this.modulesList.length) {
          this.generateWidgetList();
        }
      }
    );
  }

  public getLastPosition() {
    let position = 0;
    this.widgets.forEach((el) => {
      if (el && el.position) {
        if (el.position > position) {
          position = el.position;
        }
      }
    });
    return position;
  }

  public generateWidgetList() {
    this.userModules.forEach((el) => {
      let widgetInfo = this.getInfoAboutWidget(el, ['module_data']);
      if (widgetInfo) {
        let labelOfWidgetGroup = widgetInfo.module_data.app
          .split('_')
          .map((elem) => elem.toUpperCase())
          .join(' ');
        let appName = widgetInfo.module_data.app.replace(/_/, '-');
        let modelName = widgetInfo.module_data.plural_name.split(' ').join('').toLowerCase();
        let endpoint = `/ecore/api/v2/${appName}/${modelName}/`;
        let link = this.getLinkByEndpoint(this.pages, endpoint);
        let widget = <WidgetItem> {
          label: el.dashboard_module.name,
          link: link || '/',
          endpoint,
          position: el.position,
          ui_config: el.ui_config,
          labelOfWidgetGroup,
          id: el.id
        };
        this.widgets.push(widget);
      }
    });
    let groups = this.getListOfGroupsName(this.widgets, 'labelOfWidgetGroup');
    let widgetGroups = this.generateGroupsOfWidgets(groups, this.widgets);
    Object.keys(widgetGroups).forEach((el) => {
      this.widgetList.push(widgetGroups[el]);
    });
  }

  public generateGroupsOfWidgets(groups, widgets) {
    let widgetGroup = {};
    groups.forEach((el) => {
      widgetGroup[el] = {
        label: el,
        list: []
      };
      widgetGroup[el].list =
        [].concat(widgets.filter((elem) => elem.labelOfWidgetGroup === el));
      widgetGroup[el].list.sort((p, n) => p.position > n.position ? 1 : -1);
    });
    return widgetGroup;
  }

  public getInfoAboutWidget(widget, params) {
    let result = <any> {};
    let widgetElement = this.modulesList.filter((el) => {
      if (el.id === widget.dashboard_module.id) {
        return true;
      }
    });
    if (widgetElement && widgetElement[0]) {
      params.forEach((el) => {
        result[el] = widgetElement[0][el];
      });
    }
    return result;
  }

  public getLinkByEndpoint(pages: Page[], endpoint: string) {
    let link;
    pages.forEach((el) => {
      if (el && el.endpoint === endpoint) {
        link = el.url;
      } else {
        if (!link) {
          link = this.getLinkByEndpoint(el.childrens, endpoint);
        }
      }
    });
    return link;
  }

  public getPagesList() {
    this.navigationService.getPages().subscribe((pages: Page[]) => {
      this.pages = pages;
      this.getModelsList();
      this.getUserModules();
    });
  }

  public getListOfGroupsName(widgets, param): string[] {
    let array: string[] = [];
    widgets.forEach((el) => {
      if (array.indexOf(el[param]) === -1) {
        array.push(el[param]);
      }
    });
    return array;
  }
}
