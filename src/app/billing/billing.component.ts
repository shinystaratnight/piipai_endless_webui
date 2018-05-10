import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User, UserService } from '../services/user.service';

@Component({
  selector: 'billing-page',
  templateUrl: './billing.component.html'
})
export class BillingComponent implements OnInit {
  public user: User;
  public pagesList: any[];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit() {
    this.user = this.route.snapshot.data['user'];
    this.pagesList = this.route.snapshot.data['pagesList'];
  }

  public updateNavigation(role) {
    this.userService.currentRole(role);
    setTimeout(() => {
      this.router.navigate(['']);
    }, 150);
  }
}
