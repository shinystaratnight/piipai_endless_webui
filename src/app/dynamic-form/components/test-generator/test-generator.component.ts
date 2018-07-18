import { Component, OnInit, Input } from '@angular/core';

import { GenericFormService } from '../../services/generic-form.service';

@Component({
  selector: 'test-generator',
  templateUrl: './test-generator.component.html',
  styleUrls: ['./test-generator.component.scss']
})
export class TestGeneratorComponent implements OnInit {
  @Input() public id: string;
  @Input() public send: boolean;
  @Input() public workflowObject: string;

  public testEndpoint: string;
  public answerEndpoint: string;
  public testData: any;

  constructor(private genericFormService: GenericFormService) {}

  public ngOnInit() {
    console.log(this);
    this.testEndpoint = '/ecore/api/v2/acceptance-tests/acceptancetests/';
    this.answerEndpoint = '/ecore/api/v2/acceptance-tests/workflowobjectanswers/';

    this.genericFormService
      .getAll(`${this.testEndpoint}${this.id}/`)
      .subscribe(res => {
        this.generateTestForm(res);
      });
  }

  public generateTestForm(data: any) {
    this.testData = {
      name: data.test_name,
      description: data.description,
      relationship: '',
      questions: []
    };

    data.acceptance_test_questions.forEach((question) => {
      this.testData.questions.push(this.generateQuestion(question));
    });

    this.testData.questions.sort((p, n) => p.order > n.order ? 1 : -1);
  }

  public generateQuestion(data: any) {
    const question = {
      acceptance_test_question: data.id,
      name: data.question,
      details: data.details,
      type: data.type,
      order: data.order,
      value: 0,
      answers: []
    };

    data.acceptance_test_answers.forEach((answer) => {
      question.answers.push(this.generateAnswer(answer, data.id));
    });

    question.answers.sort((p, n) => p.order > n.order ? 1 : -1);

    return question;
  }

  public generateAnswer(data: any, name: string) {
    return {
      answer: data.answer,
      score: data.score,
      id: data.id,
      order: data.order,
      name,
    };
  }

  public sendForm() {
    const body = [];

    this.genericFormService.submitForm(this.answerEndpoint, body)
      .subscribe((res) => {
        console.log(res);
      });
  }

}

// acceptance_test_question, workflow_object, answer, answer_text, score
