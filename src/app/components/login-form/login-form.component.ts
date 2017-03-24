import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: 'login-form.component.html'
})
export class LoginFormComponent {

  public loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
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

}
