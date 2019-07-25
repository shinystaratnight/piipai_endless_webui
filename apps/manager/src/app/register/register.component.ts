import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public settings: any;
  public config: any;
  public password: boolean;

  constructor(private route: ActivatedRoute) {}

  public ngOnInit() {
    this.settings = this.route.snapshot.data['settings'];
  }

  public setFormConfig(config: any) {
    this.config = config;
  }

}
