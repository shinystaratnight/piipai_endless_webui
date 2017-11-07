import { Component, OnInit } from '@angular/core';

import { PermissionsService } from './permissions.service';

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
  selector: 'permissions',
  templateUrl: 'permissions.component.html'
})

export class PermissionsComponent implements OnInit {

  public permissionsList: Permission[];
  public targetPermissions: Permission[];
  public cashPermissions: Permission[];

  public users: User[];
  public cashUsers: User[];

  public groups: Group[];
  public targetGroups: Group[];
  public cashGroups: Group[];

  public targetId: string;

  public search = {
    list: '',
    permission: '',
    group: ''
  };

  public settings: any;
  public name: string;

  constructor(
    private service: PermissionsService
  ) {}

  public ngOnInit() {
    this.getPermissions();
    this.getGroups();
    this.getUsers();
    this.settings = {
      user: {
        list: {
          title: 'Users',
          list: this.users,
          param: 'name',
          actions: false,
          element: 'user',
          type: 'list'
        },
        permissions: {
          title: 'Permissions',
          list: this.permissionsList,
          param: 'name',
          actions: true,
          element: 'user',
          type: 'permission',
        },
        groups: {
          title: 'Groups',
          list: this.groups,
          param: 'name',
          actions: true,
          element: 'user',
          type: 'group'
        }
      },
      group: {
        list: {
          title: 'Groups',
          list: this.groups,
          param: 'name',
          actions: true,
          element: 'group',
          type: 'list'
        },
        permissions: {
          title: 'Permissions',
          list: this.permissionsList,
          param: 'name',
          actions: true,
          element: 'group',
          type: 'permission'
        }
      }
    };
  }

  public getGroups(): void {
    this.service.getAllGroups().subscribe(
      (res: any) => {
        this.cashGroups = res.results;
        this.groups = res.results;
      }
    );
  }

  public getUsers(): void {
    this.service.getAllUsers().subscribe(
      (res: any) => {
        this.users = res.results;
      }
    );
  }

  public getPermissions(): void {
    this.service.getAllPermissions().subscribe(
      (res: any) => {
        this.cashPermissions = res.results.slice();
        this.permissionsList = res.results;
      }
    );
  }

  public toggle(type: string, element: string, item: Group|Permission): void {
    if (type === 'list') {
      this.getPermissionsOf(item.id, element);
      if (element === 'user') {
        this.getGroupsOfUser(item.id);
      }
      this.targetId = item.id;
      return;
    }
    if (type === 'permission') {
      this.togglePermissions(<Permission> item, element);
    } else if (type === 'group') {
      this.toggleGroup(item);
    }
  }

  public togglePermissions(permission: Permission, type: string): void {
    if (permission.active) {
      if (type === 'user') {
        this.service.revokePermissionsOfTheUser(this.targetId, [permission.id])
                    .subscribe((res: any) => permission.active = false);
      }
      if (type === 'group') {
        this.service.revokePermissionsOfTheGroup(this.targetId, [permission.id])
                    .subscribe((res: any) => permission.active = false);
      }
    } else {
      if (type === 'user') {
        this.service.addPermissionsOnTheUser(this.targetId, [permission.id])
                    .subscribe((res: any) => permission.active = true);
      }
      if (type === 'group') {
        this.service.addPermissionsOnTheGroup(this.targetId, [permission.id])
                    .subscribe((res: any) => permission.active = true);
      }
    }
  }

  public toggleGroup(group: Group): void {
    if (!group.active) {
      this.service.addUserOnTheGroup(group.id, this.targetId).subscribe(
        (res: any) => {
          group.active = true;
        }
      );
    }
  }

  public addGroup(name: string): void {
    this.service.createGroup(name)
                .subscribe((res: any) => this.getGroups());
  }

  public removeGroup(group: Group, e: any): void {
    e.preventDefault();
    e.stopPropagation();
    this.service.deleteGroup(group.id)
                .subscribe((res: any) => this.groups.splice(this.groups.indexOf(group), 1));
  }

  public getPermissionsOf(id: string, type: string): void {
    if (type === 'user') {
      this.service.getPermissionsOfUser(id).subscribe(
        (res: any) => {
          this.targetPermissions = <Permission[]> res.results;
          this.combineElement(this.targetPermissions, this.permissionsList);
        }
      );
    }
    if (type === 'group') {
      this.service.getAllPermissionsOfTheGroup(id).subscribe(
        (res: any) => {
          this.targetPermissions = <Permission[]> res.results;
          this.combineElement(this.targetPermissions, this.permissionsList);
        }
      );
    }
  }

  public getGroupsOfUser(id) {
    this.service.getGroupsOnTheUser(id).subscribe(
      (res: any) => {
        this.targetGroups = <Group[]> res.results;
        this.combineElement(this.targetGroups, this.groups);
      }
    );
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
    let source = type === 'user' ? this.cashUsers :
      type === 'group' ? this.cashGroups :
      type === 'permission' ? this.cashPermissions : null;
    if (value && source) {
      target = source.filter((el) => {
        let val = el.name;
        if (val) {
          return val.toLowerCase().indexOf(value.toLowerCase()) > -1;
        }
      });
    } else {
      target = source.slice();
    }
  }

  public beforeChange(): void {
    this.targetId = undefined;
    this.search.list = '';
    this.search.group = '';
    this.search.permission = '';
    this.targetPermissions = [];
    this.targetGroups = [];
    this.groups = this.cashGroups.slice();
    this.permissionsList = this.cashPermissions.slice();
  };

}
