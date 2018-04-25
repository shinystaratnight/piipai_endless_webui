import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoginService } from './../../services/login.service';

@Component({
  selector: 'login-form',
  templateUrl: 'login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  public error: any = {};
  public response: any;
  public token: boolean = false;
  public endpoint = `/ecore/api/v2/auth/login/`;
  public label: any;
  public type: string;

  public loginProcess: boolean;

  constructor(
    private loginService: LoginService,
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
    this.route.queryParams.subscribe((params) => {
      let type = params['type'];
      this.type = type;
      if (type === 'crm' || type === 'extranet') {
        this.label = type === 'crm' ? 'CRM' :
          type === 'extranet' ? 'Extranet Login' : '';
      } else {
        this.label = 'Login';
      }
    });
  }

  public tokenAuth(token) {
    this.loginService.loginWithToken(token).subscribe(
      (res: any) => {
          this.router.navigate([res.data.redirect_to]);
      },
      (err) => this.router.navigate(['login']));
  }

  public responseHandler(response) {
    if (response.data) {
      this.router.navigate(['']);
    } else if (response.status === 'success') {
      this.error = {};
      this.loginProcess = false;
    }
  }

  public redirectHandler(data) {
    this.loginService.username = data;
    location.href = '/ecore/register/';
  }

  public formEvent(e) {
    if (e.type === 'saveStart') {
      this.loginProcess = true;
    }
  }

  public errorHandler() {
    this.loginProcess = false;
  }

}
