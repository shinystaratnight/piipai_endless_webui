import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PermissionsService } from './permissions.service';

interface Permission {
  id: string;
  name: string;
  codename: string;
  active?: boolean;
}

interface User {
  id: string;
  name: string;
  boolean?: false;
}

interface Group {
  id: string;
  name: string;
  codename: string;
}

@Component({
  selector: 'permissions',
  templateUrl: 'permissions.component.html'
})

export class PermissionsComponent implements OnInit {

  public permissionsList: Permission[];
  public targetPermissions: Permission[];
  public users: User[];
  public groups: Group[];

  public userId: any;
  public groupId: any;

  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;
  public limit: 10;
  public lastElement: any;
  public count: number;

  public settings = {
    user: {
      list: {
        title: 'Users',
        list: this.users,
        param: 'name',
        actions: false,
        element: 'user'
      },
      permissions: {
        title: 'Permissions',
        list: this.permissionsList,
        param: 'name',
        actions: true,
        element: 'user',
        type: 'permission',
      }
    },
    group: {
      list: {
        title: 'Grpous',
        list: this.users,
        param: 'name',
        actions: true,
        element: 'group'
      },
      permissions: {
        title: 'Permissions',
        list: this.permissionsList,
        param: 'name',
        actions: true,
        element: 'group',
        type: 'permission'
      },
      users: {
        title: 'Users',
        list: this.users,
        param: 'name',
        actions: true,
        element: 'group',
        type: 'user'
      }
    }
  };

  public mockUsers = [
    {
      id: '1',
      name: 'Tom Smith'
    },
    {
      id: '2',
      name: 'Test Testovich'
    }
  ];

  public mockPermissions = [
    {
      id: '1',
      name: 'Can Activate',
      codename: 'can_activate'
    },
    {
      id: '2',
      name: 'Not can activate',
      codename: 'not_can_activate'
    }
  ];

  public mockGroups = [
    {
      id: '1',
      name: 'Mega',
      codename: 'mega'
    },
    {
      id: '2',
      name: 'Super',
      codename: 'super'
    }
  ];

  constructor(
    private service: PermissionsService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    // this.getPermissions();
    // this.getGroups();
    // this.getUsers();
    this.users = this.mockUsers;
    this.permissionsList = this.mockPermissions;
    this.groups = this.mockGroups;
    // this.route.url.subscribe((url) => {
    //   let id = url[1].path;
    //   this.userId = id;
    // });
  }

  public getGroups() {
    this.service.getAllGroups().subscribe(
      (res: Group[]) => {
        this.groups = res;
      }
    );
  }

  public getUsers() {
    this.service.getAllUsers().subscribe(
      (res: User[]) => {
        this.users = res;
      }
    );
  }

  public getPermissions() {
    this.service.getAllPermissions().subscribe(
      (res: any) => {
        this.permissionsList = res.results;
        this.count = res.count;
      }
    );
  }

  public toggle(type, element, item) {
    if (!type) {
      this.getPermissionsOf(item.id, element);
      return;
    }
    if (type === 'permission') {
      this.togglePermissions(item, element);
    } else if (type === 'user') {
      this.toggleUsers(item);
    }
  }

  public togglePermissions(permission, type) {
    if (permission.active) {
      if (type === 'user') {
        this.service.revokePermissionsOfTheUser(this.userId, [permission.id])
                    .subscribe((res: any) => permission.active = false);
      }
      if (type === 'group') {
        this.service.revokePermissionsOfTheGroup(this.groupId, [permission.id])
                    .subscribe((res: any) => permission.activate = false);
      }
    } else {
      if (type === 'user') {
        this.service.addPermissionsOnTheUser(this.userId, [permission.id])
                    .subscribe((res: any) => permission.active = true);
      }
      if (type === 'group') {
        this.service.addPermissionsOnTheGroup(this.groupId, [permission.id])
                    .subscribe((res: any) => permission.active = true);
      }
    }
  }

  public toggleUsers(user) {
    if (this.groupId) {
      if (!user.active) {
        this.service.addUserOnTheGroup(this.groupId, user.id).subscribe(
          (res: any) => {
            user.active = true;
          }
        );
      }
    }
  }

  public addGroup(name) {
    this.service.createGroup(name)
                .subscribe((res: any) => this.getGroups());
  }

  public removeGroup(group) {
    this.service.deleteGroup(group.id)
                .subscribe((res: any) => this.groups.splice(this.groups.indexOf(group), 1));
  }

  public getPermissionsOf(id, type) {
    if (type === 'user') {
      this.service.getPermissionsOfUser(id).subscribe(
        (res: any) => {
          this.targetPermissions = res.results;
          this.combineElement(this.targetPermissions, this.permissionsList);
        }
      );
    }
    if (type === 'group') {
      this.service.getAllPermissionsOfTheGroup(id).subscribe(
        (res: any) => {
          this.targetPermissions = res.results;
          this.combineElement(this.targetPermissions, this.permissionsList);
        }
      );
    }
  }

  public combineElement(array: any[], target: any[]) {
    target.forEach((el) => {
      array.forEach((element) => {
        if (el.id === element.id) {
          el.active = true;
        }
      });
    });
    target.sort((p, n) => {
      return p.name > n.name || p.active ? 1 : -1;
    });
  }

  public onModalScrollDown() {
    this.getMore(this.lastElement);
  }

  public getMore(offset) {
    let query = '';
    query += !query ? '?' : '';
    query += `limit=${this.limit}&offset=${offset}`;
    if (!this.count || (this.count && offset < this.count)) {
      this.lastElement += this.limit;
      this.service.getAllPermissions(query).subscribe(
        (res: any) => {
          if (res.results && res.results.length) {
            this.permissionsList.push(...res.results);
            this.combineElement(this.targetPermissions, this.permissionsList);
          }
        }
      );
    }
  }

  public beforeChange(event) {
    if (event.nextId === 'user') {
      this.userId = undefined;
    } else if (event.nexId === 'group') {
      this.groupId = undefined;
    }
    this.permissionsList = []
  };

}
