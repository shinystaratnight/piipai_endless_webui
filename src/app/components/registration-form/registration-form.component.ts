import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'registration-form',
  templateUrl: 'registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {

  public settings: any;
  public config: any;
  public password: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public ngOnInit() {
    this.settings = this.route.snapshot.data['settings'];

    // this.route.url.subscribe((url) => {
    //   let urlCopy = [].concat(url);
    //   let lastElement = urlCopy.pop().path;
    //   if (lastElement === 'password') {
    //     this.endpoint = `${this.contactEndpoint}${user.id}/password/`;
    //     this.password = true;
    //   }
    // });
  }

  public setFormConfig(config: any) {
    this.config = config;
  }
}
