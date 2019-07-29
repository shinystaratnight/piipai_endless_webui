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
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  GenericFormService,
  fillingForm,
  getElementFromMetadata,
  PassTestModalComponent,
  PassTestModalConfig
} from '@webui/dynamic-form';
import { Field } from '@webui/data';

import { tests, questions, answers } from './test-builder.config';

// import { MetadataService } from '@webui/metadata';

@Component({
  selector: 'app-test-builder',
  templateUrl: './test-builder.component.html',
  styleUrls: ['./test-builder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestBuilderComponent implements OnInit, OnChanges {
  @Input() public testData: any;
  @ViewChild('preview', { static: false }) public previewModal: TemplateRef<any>;

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

  public configMap = {
    [this.testEndpoint]: tests,
    [this.questionEndpoint]: questions,
    [this.answerEndpoint]: answers
  }

  constructor(
    private genericFormService: GenericFormService,
    private modalService: NgbModal,
    // private metadata: MetadataService
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
    this.createMetadata(this.testEndpoint, 'form', data)
      .subscribe((config: Field[]) => {
        this.testMetadata = config;
      });
  }

  public createMetadata(endpoint: string, metadataType: string, data?): Observable<Field[]> {
    return of(this.configMap[endpoint][metadataType])
      .pipe(
        map((config: Field[]) => {
          const mode = new BehaviorSubject('edit');
          if (metadataType === 'form') {
            this.addModeProperty(config, mode);
          }

          if (metadataType === 'form') {
            mode.next('view');
            fillingForm(config, data);
          }

          return config;
        })
      );
  }

  public addQuestion(create: boolean, data?) {
    const metadataType = create ? 'formadd' : 'form';
    this.createMetadata(this.questionEndpoint, metadataType, data)
      .subscribe((config: Field[]) => {
        if (create) {
          const order = getElementFromMetadata(config, 'order');

          if (order) {
            order.value = ++this.questionId;
          }
        } else {
          const order = getElementFromMetadata(config, 'order');

          if (order.value > this.questionId) {
            this.questionId = order.value;
          } else {
            this.questionId += 1;
          }
        }

        this.questions.push(config);
      });
  }

  public addAnswer(create: boolean, target, data?) {
    const metadataType = create ? 'formadd' : 'form';

    this.createMetadata(this.answerEndpoint, metadataType, data)
      .subscribe((config: Field[]) => {
        if (create) {
          const order = getElementFromMetadata(config, 'order');

          const value = this.getLastOrder(target);

          if (order) {
            order.value = value;
          }
        }

        target.push(config);
      });
  }

  public getLastOrder(answers) {
    let value = 0;

    answers.forEach((answer) => {
      const order = getElementFromMetadata(answer, 'order');

      value = value > order.value ? value : order.value;
    });

    return value + 1;

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
      this.createMetadata(this.questionEndpoint, 'form', res)
        .subscribe((config: Field[]) => {
          this.answers[res.id] = this.answers[res.id] || [];

          this.questions.splice(index, 1, config);
        });
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
      this.createMetadata(this.answerEndpoint, 'form', res)
        .subscribe((config: Field[]) => {
          this.answers[id].splice(index, 1, config);
        });
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
    this.modalRef = this.modalService.open(PassTestModalComponent);
    this.modalRef.componentInstance.config = {
      testId: this.testData.id,
      send: false,
      description: this.testData.description
    } as PassTestModalConfig;
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

  public editQuestion(question) {
    const field = getElementFromMetadata(question, 'question');
    const button = getElementFromMetadata(question, 'button', 'type');
    button.templateOptions.text = 'Save';
    field.mode.next('edit');
  }

  public editAnswer(answer) {
    const field = getElementFromMetadata(answer, 'answer');
    const button = getElementFromMetadata(answer, 'button', 'type');
    button.templateOptions.text = 'Save';
    field.mode.next('edit');
  }
}
