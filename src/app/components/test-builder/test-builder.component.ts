import { Component, OnInit } from '@angular/core';

import * as acceptancetestquestionsMetadata from '../../metadata/acceptancetestquestions.metadata';
import * as acceptancetestanswersMetadata from '../../metadata/acceptancetestanswers.metadata';
import * as acceptancetestsMetadata from '../../metadata/acceptancetests.metadata';

@Component({
  selector: 'test-builder',
  templateUrl: './test-builder.component.html'
})
export class TestBuilderComponent implements OnInit {

  public questionMetadata: any[];
  public answerMetadata: any[];

  constructor() {

  }

  public ngOnInit() {
    this.questionMetadata = acceptancetestquestionsMetadata.metadata.form;
    this.answerMetadata = acceptancetestanswersMetadata.metadata.form;
  }
}
