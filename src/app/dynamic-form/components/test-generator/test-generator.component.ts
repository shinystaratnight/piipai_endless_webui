import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GenericFormService } from '../../services/generic-form.service';

@Component({
  selector: 'app-test-generator',
  templateUrl: './test-generator.component.html',
  styleUrls: ['./test-generator.component.scss']
})
export class TestGeneratorComponent implements OnInit {
  @Input() public id: string;
  @Input() public send: boolean;
  @Input() public workflowObject: string;

  @Output() public sended: EventEmitter<any> = new EventEmitter();

  public testEndpoint: string;
  public answerEndpoint: string;
  public testData: any;

  public currentQuestion = 0;

  constructor(private genericFormService: GenericFormService) {}

  public ngOnInit() {
    this.testEndpoint = '/acceptance-tests/acceptancetests/';
    this.answerEndpoint = '/acceptance-tests/workflowobjectanswers/';

    this.genericFormService
      .getAll(`${this.testEndpoint}${this.id}/`)
      .subscribe((res) => {
        this.generateTestForm(res);
      });
  }

  public generateTestForm(data: any) {
    this.testData = {
      name: data.test_name,
      description: data.description,
      relationship: '',
      industries: data.acceptance_tests_industries,
      skills: data.acceptance_tests_skills,
      tags: data.acceptance_tests_tags,
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
      workflow_object: this.workflowObject,
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
    const body = this.testData.questions.map((question) => {
      return {
        acceptance_test_question: question.acceptance_test_question,
        workflow_object: question.workflow_object,
        answer: question.answer,
        answer_text: question.answer_text,
        score: question.score
      };
    });

    this.genericFormService.submitForm(this.answerEndpoint, body)
      .subscribe((res) => {
        this.sended.emit(true);
      });
  }

  back() {
    if (this.currentQuestion !== 0) {
      this.currentQuestion -= 1;
    }
  }

  next() {
    this.currentQuestion += 1;
  }

}
