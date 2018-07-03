import {
  Component,
  ViewChild,
  OnDestroy,
  Input,
  OnChanges,
  EventEmitter,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { Page, UserService } from '../../services/';

export interface UserModelData {
  dashboard_module: string;
  position: number;
  ui_config: any;
}

export interface WidgetItem {
  label: string;
  name?: string;
  addLabel?: string;
  description?: string;
  link: string;
  endpoint: string;
  position: number;
  ui_config: any;
  id: string;
}

export interface WidgetGroup {
  label: string;
  list: WidgetItem[];
}

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnChanges, OnDestroy {

  @ViewChild('modal')
  public modal: any;

  public userModelsEndpoint = '/ecore/api/v2/core/userdashboardmodules/';
  public modelsListEndpoint = '/ecore/api/v2/core/dashboardmodules/';
  public modalRef: any;
  public userModelData: UserModelData;

  @Input()
  public modulesList: any;

  @Input()
  public userModules: any;

  @Output()
  public changeWidgetList: EventEmitter<any> = new EventEmitter();

  public availableModules: any;
  public widgetList: WidgetGroup[];

  @Input()
  public pages: Page[];

  public widgets: WidgetItem[];
  public selectedWidget: any;

  constructor(
    public modalService: NgbModal,
    private genericFormService: GenericFormService,
    public userService: UserService
  ) { }

  public ngOnChanges() {
    if (this.pages && this.userModules && this.modulesList) {
      this.widgetList = [];
      this.widgets = [];
      this.generateWidgetList();
    }
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public openModal() {
    this.selectedWidget = null;
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

  public selectModule(widget, c) {
    this.userModelData = <any> {};
    this.userModelData.dashboard_module = widget.id;
    this.userModelData.position = this.getLastPosition() + 1;
    this.userModelData.ui_config = {};
    this.selectedWidget = widget;

    this.addModule(c);
  }

  public addModule(closeModal) {
    closeModal();
    this.genericFormService.submitForm(this.userModelsEndpoint, this.userModelData).subscribe(
      (res: any) => {
        this.changeWidgetList.emit({
          changed: true
        });
      }
    );
  }

  public removeModule(widget) {
    this.genericFormService.delete(this.userModelsEndpoint, widget.id).subscribe(
      (res: any) => {
        this.changeWidgetList.emit({
          changed: true
        });
    });
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
        let endpoint;
        if (!widgetInfo.module_data.endpoint) {
          let appName = widgetInfo.module_data.app.replace(/_/, '-');
          let modelName = widgetInfo.module_data.plural_name.split(' ').join('').toLowerCase();
          endpoint = `/ecore/api/v2/${appName}/${modelName}/`;
        } else {
          endpoint = widgetInfo.module_data.endpoint;
        }
        let link = this.getLinkByEndpoint(this.pages, endpoint);
        let widget = <WidgetItem> {
          label: widgetInfo.module_data.label || widgetInfo.module_data.plural_name,
          name: widgetInfo.module_data.name,
          addLabel: widgetInfo.module_data.add_label,
          description: widgetInfo.module_data.description,
          link: el.ui_config ? link || '/' : '/',
          endpoint,
          position: el.position,
          ui_config: el.ui_config,
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

  public getListOfGroupsName(widgets, param): string[] {
    let array: string[] = [];
    widgets.forEach((el) => {
      if (array.indexOf(el[param]) === -1) {
        array.push(el[param]);
      }
    });
    return array;
  }

  public checkOnManager() {
    if (this.userService.user) {
      return this.userService.user.currentRole.__str__.includes('manager');
    }
  }
}
