import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';

import { LoginService } from './../../services/login.service';

@Component({
  selector: 'login-form',
  templateUrl: 'login-form.component.html'
})
export class LoginFormComponent {

  public loginForm: FormGroup;
  public error: any;
  public response: any;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private storage: LocalStorageService,
    private router: Router
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
          if (err.register) {
            this.router.navigate(['/register', { [err.register]: this.loginForm.value.username }]);
          } else {
            this.error = err;
          }
        }
      );
  }

}
