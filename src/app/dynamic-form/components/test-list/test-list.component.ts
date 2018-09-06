import { Component, OnInit } from '@angular/core';

import { GenericFormService } from '../../services/generic-form.service';

@Component({
  selector: 'test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {

  public config: any;
  public tests: any[];
  public colors = {
    0: '#515151',
    1: '#FA5C46',
    2: '#fc9183',
    3: '#FFA236',
    4: '#ffbf00',
    5: '#FFD042'
  };

  constructor(
    private gfs: GenericFormService
  ) {}

  public ngOnInit() {
    this.gfs.getAll(this.config.endpoint).subscribe((res) => {
      this.tests = res;
    });
  }

  public getScore(score) {
    return Math.floor(parseFloat(score));
  }

}
