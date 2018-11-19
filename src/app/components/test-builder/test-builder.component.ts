import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewEncapsulation,
  SimpleChanges,
  ViewChild,
  TemplateRef
} from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';

import { GenericFormService } from '../../dynamic-form/services';

import { Field } from '../../dynamic-form/models';
import {
  fillingForm,
  getElementFromMetadata
} from '../../dynamic-form/helpers/utils';

import * as questionMetadata from '../../metadata/acceptancetestquestions.metadata';
import * as answerMetadata from '../../metadata/acceptancetestanswers.metadata';
import * as testMetadata from '../../metadata/acceptancetests.metadata';

@Component({
  selector: 'app-test-builder',
  templateUrl: './test-builder.component.html',
  styleUrls: ['./test-builder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestBuilderComponent implements OnInit, OnChanges {
  @Input() public testData: any;
  @ViewChild('preview') public previewModal: TemplateRef<any>;

  public testMetadata: Field[];

  public testId: string;

  public saveProcess: boolean;
  public questionId: number;
  public modalRef: NgbModalRef;

  public questions = [];
  public answers = {};

  public testEndpoint = '/acceptance-tests/acceptancetests/';
  public questionEndpoint = '/acceptance-tests/acceptancetestquestions/';
  public answerEndpoint = '/acceptance-tests/acceptancetestanswers/';
  public configs = {
    test: testMetadata,
    question: questionMetadata,
    answer: answerMetadata
  };

  constructor(
    private genericFormService: GenericFormService,
    private modalService: NgbModal
  ) {}

  public ngOnInit() {
    this.questionId = 1;
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (
      changes.hasOwnProperty('testData') &&
      !changes['testData'].isFirstChange()
    ) {
      this.checkQuestions(this.testData);
    }
  }

  public addModeProperty(metadata, mode) {
    metadata.forEach((el) => {
      if (el.key) {
        el.mode = mode;
      } else if (el.children) {
        this.addModeProperty(el.children, mode);
      }
    });
  }

  public updateTestForm(data) {
    this.testId = data.id;
    this.testMetadata = this.createMetadata('test', 'form', data);
  }

  public createMetadata(type: string, metadataType: string, data?): Field[] {
    const config = JSON.parse(
      JSON.stringify(this.configs[type].metadata[metadataType])
    );

    if (metadataType === 'form') {
      const mode = new BehaviorSubject('edit');
      this.addModeProperty(config, mode);
    }

    if (metadataType === 'form') {
      fillingForm(config, data);
    }

    return config;
  }

  public addQuestion(create: boolean, data?) {
    const metadataType = create ? 'formadd' : 'form';
    const metadata = this.createMetadata('question', metadataType, data);
    if (create) {
      const order = getElementFromMetadata(metadata, 'order');

      if (order) {
        order.value = ++this.questionId;
      }
    } else {
      const order = getElementFromMetadata(metadata, 'order');

      if (order.value > this.questionId) {
        this.questionId = order.value;
      } else {
        this.questionId += 1;
      }
    }

    this.questions.push(metadata);
  }

  public addAnswer(create: boolean, target, data?) {
    const metadataType = create ? 'formadd' : 'form';
    const metadata = this.createMetadata('answer', metadataType, data);
    if (create) {
      const order = getElementFromMetadata(metadata, 'order');

      if (order) {
        order.value = target.length;
      }
    }

    target.push(metadata);
  }

  public checkQuestions(data: any) {
    if (data && data.acceptance_test_questions) {
      const questions = data.acceptance_test_questions;

      questions.forEach((question) => {
        this.addQuestion(false, question);

        this.answers[question.id] = [];

        this.checkAnswers(question);
      });
    }
  }

  public checkAnswers(data: any) {
    if (data && data.acceptance_test_answers) {
      const answers = data.acceptance_test_answers;

      answers.forEach((answer) => {
        this.addAnswer(false, this.answers[data.id], answer);
      });
    }
  }

  public saveQuestion(data, index: number, update: string) {
    data.acceptance_test = this.testData.id;
    let action;
    if (update) {
      action = 'editForm';
    } else {
      action = 'submitForm';
    }

    this.genericFormService[action](
      this.questionEndpoint + (update ? data.id + '/' : ''),
      data
    ).subscribe((res) => {
      const metadata = this.createMetadata('question', 'form', res);
      this.answers[res.id] = this.answers[res.id] || [];

      this.questions.splice(index, 1, metadata);
    });
  }

  public deleteQuestion(id: string, target: any[], index: number) {
    if (id) {
      this.genericFormService.delete(this.questionEndpoint, id).subscribe(() => {
        target.splice(index, 1);
      });
    } else {
      target.splice(index, 1);
    }
  }

  public deleteAnswer(id: string, target: any[], index: number) {
    if (id) {
      this.genericFormService.delete(this.answerEndpoint, id).subscribe(() => {
        target.splice(index, 1);
      });
    } else {
      target.splice(index, 1);
    }
  }

  public saveAnswer(data, index: number, id: string, update: string) {
    data.acceptance_test_question = id;

    let action;
    if (update) {
      action = 'editForm';
    } else {
      action = 'submitForm';
    }

    this.genericFormService[action](
      this.answerEndpoint + (update ? data.id + '/' : ''),
      data
    ).subscribe((res) => {
      const metadata = this.createMetadata('answer', 'form', res);

      this.answers[id].splice(index, 1, metadata);
    });
  }

  public getId(metadata: Field[]): string {
    const id = getElementFromMetadata(metadata, 'id');

    if (id) {
      return id.value;
    }
  }

  public getType(metadata: Field[]): number {
    const type = getElementFromMetadata(metadata, 'type');

    if (type) {
      return type.value;
    }
  }

  public showPreview() {
    this.modalRef = this.modalService.open(this.previewModal, { size: 'lg' });
  }

  public checkCount(type: number, length: number) {
    if (type === 0) {
      return true;
    }

    if (type === 2 && length < 2) {
      return true;
    }

    return false;
  }
}
