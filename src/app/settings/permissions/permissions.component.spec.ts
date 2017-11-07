import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  inject,
  async } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';

import { PermissionsComponent, Group, User, Permission } from './permissions.component';
import { PermissionsService } from './permissions.service';

describe('PermissionsComponent', () => {

  let comp: PermissionsComponent;
  let fixture: ComponentFixture<PermissionsComponent>;
  let response: any = {
    data: {}
  };

  const mockPermissionsService = {
    getAllGroups() {
      return Observable.of(response.data);
    },
    getAllUsers() {
      return Observable.of(response.data);
    },
    getPermissions() {
      return Observable.of(response.data);
    },
    revokePermissionsOfTheUser() {
      return Observable.of(true);
    },
    revokePermissionsOfTheGroup() {
      return Observable.of(true);
    },
    addPermissionsOnTheUser() {
      return Observable.of(true);
    },
    addPermissionsOnTheGroup() {
      return Observable.of(true);
    },
    addUserOnTheGroup() {
      return Observable.of(true);
    },
    createGroup() {
      return Observable.of(true);
    },
    deleteGroup() {
      return Observable.of(true);
    },
    getPermissionsOfUser() {
      return Observable.of(response.data);
    },
    getAllPermissionsOfTheGroup() {
      return Observable.of(response.data);
    },
    getAllPermissions() {
      return Observable.of(response.data);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionsComponent],
      providers: [
        { provide: PermissionsService, useValue: mockPermissionsService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PermissionsComponent);
        comp = fixture.componentInstance;
      });
  }));

  describe('ngOnInit method', () => {
    it('should call methods', () => {
      spyOn(comp, 'getPermissions');
      spyOn(comp, 'getGroups');
      spyOn(comp, 'getUsers');
      comp.ngOnInit();
      expect(comp.getPermissions).toHaveBeenCalled();
      expect(comp.getGroups).toHaveBeenCalled();
      expect(comp.getUsers).toHaveBeenCalled();
    });
  });

  describe('getGroups method', () => {
    it('should get groups of company', () => {
      response.data.results = [];
      comp.getGroups();
      expect(comp.groups).toEqual(response.data.results);
    });
  });

  describe('getUsers method', () => {
    it('should get users of company', () => {
      response.data.results = [];
      comp.getUsers();
      expect(comp.users).toEqual(response.data.results);
    });
  });

  describe('getPermissions method', () => {
    it('should get permissions list', () => {
      response.data.results = [];
      comp.getPermissions();
      expect(comp.permissionsList).toEqual(response.data.results);
    });
  });

  describe('toggle method', () => {
    it('should call getPermissionOf method', () => {
      const type = 'list';
      const element = 'group';
      const item: Group = {
        id: '1',
        name: 'Managers'
      };
      spyOn(comp, 'getPermissionsOf');
      comp.toggle(type, element, item);
      expect(comp.getPermissionsOf).toHaveBeenCalled();
      expect(comp.targetId).toEqual(item.id);
    });

    it('should call togglePermissions method', () => {
      const type = 'permission';
      const element = 'user';
      const item: Permission = {
        id: '1',
        name: 'can activate',
        codename: 'can_activate'
      };
      spyOn(comp, 'togglePermissions');
      comp.toggle(type, element, item);
      expect(comp.togglePermissions).toHaveBeenCalledWith(item, element);
    });

    it('should call toggleGroup method', () => {
      const type = 'group';
      const element = 'user';
      const item: Group = {
        id: '1',
        name: 'Managers'
      };
      spyOn(comp, 'toggleGroup');
      comp.toggle(type, element, item);
      expect(comp.toggleGroup).toHaveBeenCalledWith(item);
    });
  });

  describe('togglePermissions method', () => {
    let permission: Permission;
    beforeEach(() => {
      permission = {
        id: '1',
        name: 'Can Activate',
        codename: 'can_activate'
      };
    });

    it('should revoke permission from user' , () => {
      const type = 'user';
      permission.active = true;
      comp.togglePermissions(permission, type);
      expect(permission.active).toBeFalsy();
    });

    it('should revoke permission from group', () => {
      const type = 'group';
      permission.active = true;
      comp.togglePermissions(permission, type);
      expect(permission.active).toBeFalsy();
    });

    it('should add new permission for user', () => {
      const type = 'user';
      permission.active = false;
      comp.togglePermissions(permission, type);
      expect(permission.active).toBeTruthy();
    });

    it('should add new permission for group', () => {
      const type = 'group';
      permission.active = false;
      comp.togglePermissions(permission, type);
      expect(permission.active).toBeTruthy();
    });
  });

  describe('toggleGroup method', () => {
    it('should add a user to group', () => {
      const group: Group = {
        id: '1',
        name: 'Mahagers'
      };
      comp.toggleGroup(group);
      expect(group.active).toBeTruthy();
    });
  });

  describe('addGroup method', () => {
    it('should create new group', () => {
      const name = 'Managers';
      spyOn(comp, 'getGroups');
      comp.addGroup(name);
      expect(comp.getGroups).toHaveBeenCalled();
    });
  });

  describe('removeGroup method', () => {
    it('should remove group', () => {
      const group: Group = {
        id: '1',
        name: 'Managers'
      };
      const event = {
        preventDefault() {
          return true;
        },
        stopPropagation() {
          return true;
        }
      };
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      comp.groups = [];
      comp.groups.push(group);
      comp.removeGroup(group, event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(comp.groups.length).toEqual(0);
    });
  });

  describe('getPermissionsOf', () => {
    it('should update permissions of user', () => {
      const id = '1';
      const type = 'user';
      response.data.results = [];
      comp.permissionsList = [];
      spyOn(comp, 'combineElement');
      comp.getPermissionsOf(id, type);
      expect(comp.combineElement).toHaveBeenCalledWith(response.data.results, []);
    });

    it('should update permissions of group', () => {
      const id = '1';
      const type = 'group';
      response.data.results = [];
      comp.permissionsList = [];
      spyOn(comp, 'combineElement');
      comp.getPermissionsOf(id, type);
      expect(comp.combineElement).toHaveBeenCalledWith(response.data.results, []);
    });
  });

  describe('combineElement method', () => {
    it('should combine user permission with permission list', () => {
      const data: Permission[] = [
        {
          id: '1',
          name: 'Can set contact',
          codename: 'can_set_contact'
        }
      ];
      const permissionsList: Permission[] = [
        {
          id: '1',
          name: 'Can set contact',
          codename: 'can_set_contact'
        },
        {
          id: '2',
          name: 'Can get contacts',
          codename: 'can_get_contatcs'
        }
      ];
      comp.combineElement(data, permissionsList);
      expect(permissionsList[0].active).toBeTruthy();
    });
  });

  describe('beforeChange', () => {
    it('should reset properties', () => {
      comp.targetId = '2';
      comp.permissionsList = [
        {
          id: '1',
          name: 'Can activate',
          codename: 'can_activate'
        }
      ];
      comp.targetPermissions = [
        {
          id: '1',
          name: 'Can activate',
          codename: 'can_activate'
        }
      ];
      comp.beforeChange();
      expect(comp.targetId).toBeUndefined();
      expect(comp.permissionsList).toEqual([]);
      expect(comp.targetPermissions).toEqual([]);
    });
  });

});
