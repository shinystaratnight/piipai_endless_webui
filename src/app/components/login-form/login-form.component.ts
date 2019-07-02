import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'ngx-webstorage';

import { AuthService, UserService } from '../../services';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-form',
  templateUrl: 'login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginFormComponent implements OnInit, OnDestroy {

  @ViewChild('modal') public modal;

  public label: any;
  public response: any;
  public loginProcess: boolean;
  public settings: any;
  public modalRef: NgbModalRef;

  public error = {};
  public token = false;
  public endpoint = `/auth/login/`;
  public rememberMe = false;
  public subdomain: boolean;

  public data = {
    client_id: {
      action: 'add',
      data: {
        value: environment.clientId
      }
    },
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
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  public ngOnInit() {
    this.userService.user = null;
    this.route.params.subscribe((params) => {
      this.token = params['token'];
      if (this.token) {
        this.tokenAuth(this.token);
      }
    });

    this.settings = this.route.snapshot.data['settings'];
    this.subdomain = location.host.split('.').length > 2;
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public tokenAuth(token) {
    this.authService.loginWithToken(token).subscribe(
      (res: any) => {
        this.authService.role = res.data.role;
        this.authService.storeToken({ data: res });
        this.router.navigateByUrl(res.data.redirect_to);
      },
      () => this.router.navigate(['login']));
  }

  public responseHandler(response) {
    if (response.data) {
      if (response.data.redirect) {
        location.href = response.data.redirect;

        return;
      }

      this.authService.storeToken(response, this.rememberMe, response.formData.username);
      this.router.navigate(['']);
    }
  }

  public redirectHandler(data) {
    if (this.subdomain) {
      this.router.navigate(['/registration']);
    }
  }

  public formEvent(e) {
    if (e.type === 'saveStart') {
      this.loginProcess = true;
    }
  }

  public errorHandler() {
    this.loginProcess = false;
  }

  public openResetForm() {
    this.modalRef = this.modalService.open(this.modal);

    return false;
  }

}
