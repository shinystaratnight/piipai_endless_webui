import {
  Component,
  ViewChild,
  OnDestroy,
  Input,
  OnChanges,
  EventEmitter,
  Output
} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GenericFormService } from '@webui/dynamic-form';
import { UserService } from '@webui/core';
import { Page } from '@webui/data';

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
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnChanges, OnDestroy {

  public userModelsEndpoint = '/core/userdashboardmodules/';
  public modelsListEndpoint = '/core/dashboardmodules/';
  public modalRef: any;
  public userModelData: UserModelData;
  public availableModules: any;
  public widgetList: WidgetGroup[];
  public widgets: WidgetItem[];
  public selectedWidget: any;

  @Input() public modulesList: any;
  @Input() public userModules: any;
  @Input() public pages: Page[];

  @Output() public changeWidgetList: EventEmitter<any> = new EventEmitter();

  @ViewChild('modal', { static: false }) public modal: any;

  constructor(
    public modalService: NgbModal,
    private genericFormService: GenericFormService,
    public userService: UserService
  ) { }

  public ngOnChanges() {
    if (this.pages && this.userModules && this.modulesList) {
      this.widgetList = [];
      this.widgets = [];
      if (this.userModules.length && this.modulesList.length) {
        this.generateWidgetList();
      }
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
      const exist = this.userModules.filter((elem) => {
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
      const widgetInfo = this.getInfoAboutWidget(el, ['module_data']);
      if (widgetInfo) {
        let endpoint;
        if (!widgetInfo.module_data.endpoint) {
          const appName = widgetInfo.module_data.app.replace(/_/, '-');
          const modelName = widgetInfo.module_data.plural_name.split(' ').join('').toLowerCase();
          endpoint = `/${appName}/${modelName}/`;
        } else {
          endpoint = widgetInfo.module_data.endpoint;
        }
        const link = this.getLinkByEndpoint(this.pages, endpoint);
        const widget = <WidgetItem> {
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
    const groups = this.getListOfGroupsName(this.widgets, 'labelOfWidgetGroup');
    const widgetGroups = this.generateGroupsOfWidgets(groups, this.widgets);
    Object.keys(widgetGroups).forEach((el) => {
      this.widgetList.push(widgetGroups[el]);
    });
  }

  public generateGroupsOfWidgets(groups, widgets) {
    const widgetGroup = {};
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
    let result;
    const widgetElement = this.modulesList.filter((el) => {
      if (el.id === widget.dashboard_module.id) {
        return true;
      }
    });
    if (widgetElement && widgetElement[0]) {
      result = {};
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
    const array: string[] = [];
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
