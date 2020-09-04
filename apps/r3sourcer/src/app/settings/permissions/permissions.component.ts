import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, combineLatest } from 'rxjs';

import { PermissionsService } from './permissions.service';
import { SettingsService } from '../settings.service';

export interface Permission {
  id: string;
  name: string;
  codename: string;
  active?: boolean;
}

export interface User {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  active?: boolean;
}

@Component({
  selector: 'app-permissions',
  templateUrl: 'permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit, OnDestroy {
  public permissionsList: Permission[];
  public targetPermissions: Permission[];
  public cashPermissions: Permission[];

  public users: User[];
  public cashUsers: User[];

  public groups: Group[];
  public userGroups: Group[];
  public targetGroups: Group[];
  public cashGroups: Group[];
  public cashUserGroups: Group[];

  public targetId: string;

  public search = {
    list: '',
    permission: '',
    group: ''
  };

  public name: string;

  public urlSubscription: Subscription;

  constructor(
    private service: PermissionsService,
    private route: ActivatedRoute,
    private settingsService: SettingsService
  ) {}

  public ngOnInit() {
    this.urlSubscription = this.route.url.subscribe((url) => {
      this.settingsService.url = <any>url;
    });
    this.getPermissions();
    this.getGroups();
    this.getUsers();
  }

  public ngOnDestroy() {
    this.urlSubscription.unsubscribe();
  }

  public getGroups(): void {
    this.service.getAllGroups().subscribe((res: any) => {
      this.cashGroups = res.results;
      this.groups = [].concat(res.results);
    });
  }

  public getUsers(): void {
    this.service.getAllUsers().subscribe((res: any) => {
      this.cashUsers = res.user_list;
      this.users = [].concat(res.user_list);
    });
  }

  public getPermissions(): void {
    this.service.getAllPermissions().subscribe((res: any) => {
      this.cashPermissions = res.permission_list;
      this.permissionsList = [].concat(this.cashPermissions);
    });
  }

  public toggle(type: string, element: string, item: Group | Permission): void {
    if (type === 'list') {
      this.getPermissionsOf(item.id, element);
      if (element === 'user') {
        this.getGroupsOfUser(item.id);
      }
      this.targetId = item.id;
      this.resetData(this.groups);
      this.resetData(this.permissionsList);
      return;
    }
    if (type === 'permission') {
      this.togglePermissions(<Permission>item, element);
    } else if (type === 'group') {
      this.toggleGroup(item);
    }
  }

  public togglePermissions(permission: Permission, type: string): void {
    if (permission.active) {
      if (type === 'user') {
        this.service
          .revokePermissionsOfTheUser(this.targetId, [permission.id])
          .subscribe((res: any) => (permission.active = false));
      }
      if (type === 'group') {
        this.service
          .revokePermissionsOfTheGroup(this.targetId, [permission.id])
          .subscribe((res: any) => (permission.active = false));
      }
    } else {
      if (type === 'user') {
        this.service
          .addPermissionsOnTheUser(this.targetId, [permission.id])
          .subscribe((res: any) => (permission.active = true));
      }
      if (type === 'group') {
        this.service
          .addPermissionsOnTheGroup(this.targetId, [permission.id])
          .subscribe((res: any) => (permission.active = true));
      }
    }
  }

  public toggleGroup(group: Group): void {
    if (!group.active) {
      this.service
        .addUserOnTheGroup(group.id, this.targetId)
        .subscribe((res: any) => {
          group.active = true;
        });
    } else if (group.active) {
      this.service
        .removeUserOnTheGroup(group.id, this.targetId)
        .subscribe((res: any) => {
          group.active = false;
        });
    }
  }

  public addGroup(name: string): void {
    this.service.createGroup(name).subscribe((res: any) => {
      this.name = '';
      this.getGroups();
    });
  }

  public removeGroup(group: Group, e: any): void {
    e.preventDefault();
    e.stopPropagation();
    this.service.deleteGroup(group.id).subscribe((res: any) => {
      this.cashGroups.splice(this.groups.indexOf(group), 1);
      this.groups.splice(this.groups.indexOf(group), 1);
      if (this.targetId === group.id) {
        this.targetId = undefined;
      }
    });
  }

  public getPermissionsOf(id: string, type: string): void {
    if (type === 'user') {
      this.service.getPermissionsOfUser(id).subscribe((res: any) => {
        this.targetPermissions = <Permission[]>res.permission_list;
        this.combineElement(this.targetPermissions, this.permissionsList);
      });
    }
    if (type === 'group') {
      this.service.getAllPermissionsOfTheGroup(id).subscribe((res: any) => {
        this.targetPermissions = <Permission[]>res.permission_list;
        this.combineElement(this.targetPermissions, this.permissionsList);
      });
    }
  }

  public getGroupsOfUser(id) {
    combineLatest([
      this.service.getAvailableGroupsOnTheUser(id),
      this.service.getGroupsOnTheUser(id)
    ]).subscribe((response: any) => {
      this.cashUserGroups = response[0].results;
      this.userGroups = [...response[0].results];

      this.targetGroups = <Group[]>response[1].results;
      this.combineElement(this.targetGroups, this.userGroups);
    });
  }

  public combineElement(responseData: any[], target: any[]): void {
    target.forEach((el) => {
      responseData.forEach((element) => {
        if (el.id === element.id) {
          el.active = true;
        }
      });
    });
  }

  public filter(value, type, target, element) {
    type = type === 'list' ? element : type;
    const source =
      type === 'user'
        ? this.cashUsers
        : type === 'group'
        ? this.cashGroups
        : type === 'permission'
        ? this.cashPermissions
        : null;
    if (value && source) {
      target.length = 0;
      const newArray = source.filter((el) => {
        const val = el.name;
        if (val) {
          return val.toLowerCase().indexOf(value.toLowerCase()) > -1;
        }
      });
      target.push(...newArray);
    } else {
      target.length = 0;
      target = source ? target.push(...source) : [];
    }
  }

  public beforeChange(): void {
    this.targetId = undefined;
    this.search.list = '';
    this.search.group = '';
    this.search.permission = '';
    this.targetPermissions = [];
    this.targetGroups = [];
    this.groups.length = 0;
    this.permissionsList.length = 0;
    this.groups = [].concat(this.cashGroups);
    this.permissionsList = [].concat(this.cashPermissions);
    this.resetData(this.groups);
    this.resetData(this.permissionsList);
  }

  public resetData(array: any[]) {
    array.forEach((el) => {
      delete el.active;
    });
  }

  public selectAll(type) {
    if (type === 'user') {
      this.service
        .addPermissionsOnTheUser(
          this.targetId,
          this.permissionsList.map((el) => el.id)
        )
        .subscribe((res: any) =>
          this.permissionsList.forEach((el) => (el.active = true))
        );
    }
    if (type === 'group') {
      this.service
        .addPermissionsOnTheGroup(
          this.targetId,
          this.permissionsList.map((el) => el.id)
        )
        .subscribe((res: any) =>
          this.permissionsList.forEach((el) => (el.active = true))
        );
    }
  }

  public removeAll(type) {
    if (type === 'user') {
      this.service
        .revokePermissionsOfTheUser(
          this.targetId,
          this.permissionsList.map((el) => el.id)
        )
        .subscribe((res: any) =>
          this.permissionsList.forEach((el) => (el.active = false))
        );
    }
    if (type === 'group') {
      this.service
        .revokePermissionsOfTheGroup(
          this.targetId,
          this.permissionsList.map((el) => el.id)
        )
        .subscribe((res: any) =>
          this.permissionsList.forEach((el) => (el.active = false))
        );
    }
  }
}
