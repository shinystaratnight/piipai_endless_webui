import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';

import { LoginService } from './../../services/login.service';

@Component({
  selector: 'login-form',
  templateUrl: 'login-form.component.html'
})
export class LoginFormComponent implements OnInit {

  public error: any = {};
  public response: any;
  public token: boolean = false;
  public endpoint = `/ecore/api/v2/login/`;

  constructor(
    private loginService: LoginService,
    private storage: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
      if (this.token) {
        this.tokenAuth(this.token);
      }
    });
  }

  public tokenAuth(token) {
    this.loginService.loginWithToken(this.endpoint, token).subscribe(
      (res: any) => {
          this.storage.store('contact', res.data.contact);
          this.router.navigate([res.data.redirect_to]);
      },
      (err) => this.router.navigate(['login']));
  }

  public responseHandler(response) {
    if (response.data) {
      this.storage.store('contact', response.data.contact);
      this.router.navigate(['/']);
    } else if (response.status === 'success') {
      this.error = {};
    }
  }

  public redirectHandler(data) {
    this.loginService.username = data;
    this.router.navigate(['/registration']);
  }

}
