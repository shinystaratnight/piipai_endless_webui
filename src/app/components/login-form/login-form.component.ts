import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoginService } from './../../services/login.service';

@Component({
  selector: 'login-form',
  templateUrl: 'login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginFormComponent implements OnInit {

  public label: any;
  public response: any;
  public loginProcess: boolean;
  public settings: any;

  public error = {};
  public token = false;
  public endpoint = `/ecore/api/v2/auth/login/`;
  public rememberMe = false;
  public additionalData = {
    remember_me: false
  };

  public data = {
    username: {
      action: 'add',
      data: {
        label: '',
        templateOptions: {
          required: true,
          placeholder: 'Login',
          addon: '/assets/img/mail.svg',
          max: 255
        }
      }
    },
    password: {
      action: 'add',
      data: {
        label: '',
        templateOptions: {
          required: false,
          placeholder: 'Password',
          addon: '/assets/img/key.svg',
          type: 'password',
          max: 128
        }
      }
    }
  };

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
      if (this.token) {
        this.tokenAuth(this.token);
      }
    });

    this.settings = this.route.snapshot.data['settings'];
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
    this.router.navigate(['/registration']);
  }

  public formEvent(e) {
    if (e.type === 'saveStart') {
      this.loginProcess = true;
    }
  }

  public errorHandler() {
    this.loginProcess = false;
  }

  public updateCheckbox(value: boolean) {
    this.rememberMe = value;
    this.additionalData.remember_me = this.rememberMe;
  }

}
