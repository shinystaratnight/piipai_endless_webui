import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-redirect',
  template: ''
})
export class RedirectComponent implements OnInit, OnDestroy {

  private querySubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit() {
    this.querySubscription = this.route.queryParams.subscribe((params) => {
      const redirectUri = params['state'];
      if (redirectUri && location.host === 'r3sourcer.com') {
        location.href = redirectUri + location.search;
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }

  public ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

}
