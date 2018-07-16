import { Component, OnInit, Input } from '@angular/core';

import { GenericFormService } from '../../dynamic-form/services';

import { Field } from '../../dynamic-form/models';
import { fillingForm } from '../../dynamic-form/helpers/utils';

import * as acceptancetestquestionsMetadata from '../../metadata/acceptancetestquestions.metadata';
import * as acceptancetestanswersMetadata from '../../metadata/acceptancetestanswers.metadata';
import * as acceptancetestsMetadata from '../../metadata/acceptancetests.metadata';

@Component({
  selector: 'test-builder',
  templateUrl: './test-builder.component.html',
  styleUrls: ['./test-builder.component.scss']
})
export class TestBuilderComponent implements OnInit {

  @Input() public id: string;

  public acceptanceTestsMetadata: any[];

  public testId: string;

  public saveProcess: boolean;

  public acceptancetestsEndpoint = '/ecore/api/v2/acceptance-tests/acceptancetests/';
  public acceptancetestquestionsEndpoint = '/ecore/api/v2/acceptance-tests/acceptancetestquestions/';

  public questions = [];
  public answers = {};

  constructor(
    private genericFormService: GenericFormService
  ) {

  }

  public ngOnInit() {
    console.log(this);
    if (this.id) {
      this.genericFormService.getAll(this.acceptancetestsEndpoint + this.id + '/')
        .subscribe((res) => {
          this.updateTestForm(res);
        });
    } else {
      this.acceptanceTestsMetadata = acceptancetestsMetadata.metadata.formadd;
    }
  }

  public createTest(data) {
    this.genericFormService.submitForm(this.acceptancetestsEndpoint, data)
      .subscribe((res) => {
        this.updateTestForm(res);
      });
  }

  public updateTestForm(data) {
    this.testId = data.id;
    this.acceptanceTestsMetadata = acceptancetestsMetadata.metadata.form;

    fillingForm(this.acceptanceTestsMetadata, data);
  }

  public addQuestion() {
    const metadata = JSON.parse(JSON.stringify(acceptancetestquestionsMetadata.metadata.formadd));
    const test = metadata.find((el) => el.key === 'acceptance_test');
    test.value = this.testId;

    this.questions.push(metadata);
  }

  public addAnswer() {

  }

  public saveQuestion() {
    this.genericFormService.submitForm()
  }
}
