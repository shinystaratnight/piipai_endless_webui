import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  AuthService,
  UserService,
} from '@webui/core';

@Component({
  selector: 'app-loginas',
  templateUrl: 'loginas.component.html'
})
export class LoginasComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.params.id;

    this.loginAs(userId);
  }

  private loginAs(id: string) {
    const endpoint = `/auth/${id}/loginas/`

    this.http.post(endpoint, {})
      .subscribe((res: any) => {
        const helper = new JwtHelperService();
        const token = helper.decodeToken(res.access_token_jwt);
        this.authService.storeToken(res);
        this.userService.getUserData().subscribe(() => {
          location.href = '/';
        });
      },
      () => location.href = '/'
    );
  }

}
