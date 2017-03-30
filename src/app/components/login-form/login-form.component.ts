import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';

import { LoginService } from './../../services/login.service';

@Component({
  selector: 'login-form',
  templateUrl: 'login-form.component.html'
})
export class LoginFormComponent implements OnInit {

  public loginForm: FormGroup;
  public error: any;
  public response: any;
  public token: boolean = false;
  public usernameField: any;
  public passwordField: any;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private storage: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.compose([
        Validators.required,
        this.validateEmail,
        this.validatePhone
      ])],
      password: ''
    });
  }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
      if (this.token) {
        this.tokenAuth(this.token);
      }
    });
    this.getMetaData();
  }

  public validateEmail(c: FormControl) {
    let reg =
      /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;

    return reg.test(c.value) ? null : {
      validateEmail: {
        valid: false
      }
    };
  }

  public validatePhone(c: FormControl) {
    let reg = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    return reg.test(c.value) ? null : {
      validatePhone: {
        valid: false
      }
    };
  }

  public login() {
    this.response = null;
    this.error = null;
    this.loginService.login(this.loginForm.value)
      .subscribe(
        (res: any) => {
          if (res.data) {
            this.storage.store('contact', res.data.contact);
            this.router.navigate(['/']);
          } else if (res.message) {
            this.response = res.message;
          }
        },
        (err) => {
          if (err.errors.register) {
            this.router.navigate(['/register']);
          } else {
            this.error = err;
          }
        }
      );
  }

  public tokenAuth(token) {
    this.loginService.loginWithToken(token).subscribe(
      (res: any) => {
          this.storage.store('contact', res.data.contact);
          this.router.navigate([res.data.redirect_to]);
      },
      (err) => this.router.navigate(['login']));
  }

  public getMetaData() {
    this.loginService.getMetaData().subscribe(
      (res: any) => {
        this.usernameField = res.fields.username;
        this.passwordField = res.fields.password;
      },
      (err) => this.error = err
    );
  }

}
