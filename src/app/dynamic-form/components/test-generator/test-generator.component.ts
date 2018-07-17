import { Component, OnInit, Input } from '@angular/core';

import { GenericFormService } from '../../services/generic-form.service';

@Component({
  selector: 'test-generator',
  templateUrl: './test-generator.component.html'
})
export class TestGeneratorComponent implements OnInit {
  @Input() public id: string;

  public testEndpoint: string;
  public formConfig: any;

  constructor(private genericFormService: GenericFormService) {}

  public ngOnInit() {
    this.testEndpoint = '/ecore/api/v2/acceptance-tests/acceptancetests/';

    this.genericFormService
      .getAll(`${this.testEndpoint}${this.id}/`)
      .subscribe(res => {
        this.generateTestForm(res);
      });
  }

  public generateTestForm(data: any) {
    this.formConfig = {
      name: data.test_name,
      description: data.description,
      relationship: '',
      questions: []
    };
  }

  public generateQuestion(data: any) {
    return {
      name: data.question,
      details: data.details,
      type: data.type
    };
  }
}
