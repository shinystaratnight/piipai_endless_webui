import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  TemplateRef
} from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import {
  GenericFormService,
  fillingForm,
  getElementFromMetadata,
  PassTestModalComponent,
  PassTestModalConfig
} from '@webui/dynamic-form';
import { Field, Endpoints } from '@webui/data';

import {
  testMetadata,
  questionMetadata,
  answerMetadata
} from './test-builder.config';

@Component({
  selector: 'app-test-builder',
  templateUrl: './test-builder.component.html',
  styleUrls: ['./test-builder.component.scss']
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

  pictures: Map<string, Array<{ id: string; src: string }>> = new Map();
  pictureLoading: Map<string, boolean> = new Map();

  public configMap = {
    [Endpoints.AcceptenceTest]: testMetadata,
    [Endpoints.AcceptenceTestQuestion]: questionMetadata,
    [Endpoints.AcceptenceTestAnswers]: answerMetadata
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
      this.setPictures(this.testData);
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
    this.createMetadata(Endpoints.AcceptenceTest, 'form', data).subscribe(
      (config: Field[]) => {
        this.testMetadata = config;
      }
    );
  }

  public createMetadata(
    endpoint: string,
    metadataType: string,
    data?
  ): Observable<Field[]> {
    return of(this.configMap[endpoint][metadataType]).pipe(
      map((config: Field[]) => {
        config = JSON.parse(JSON.stringify(config));

        const mode = new BehaviorSubject('edit');
        const button = getElementFromMetadata(config, 'button', 'type');
        const hidden = new BehaviorSubject(false);
        button.hidden = hidden;
        if (metadataType === 'form') {
          this.addModeProperty(config, mode);
        }

        if (metadataType === 'form') {
          mode.next('view');
          hidden.next(true);
          fillingForm(config, data);
        }

        return config;
      })
    );
  }

  public addQuestion(create: boolean, data?) {
    const metadataType = create ? 'formadd' : 'form';
    this.createMetadata(
      Endpoints.AcceptenceTestQuestion,
      metadataType,
      data
    ).subscribe((config: Field[]) => {
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

    this.createMetadata(
      Endpoints.AcceptenceTestAnswers,
      metadataType,
      data
    ).subscribe((config: Field[]) => {
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
      const questions = data.acceptance_test_questions.sort((prev, next) =>
        prev.order > next.order ? 1 : -1
      );

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
      Endpoints.AcceptenceTestQuestion + (update ? data.id + '/' : ''),
      data
    ).subscribe((res) => {
      this.createMetadata(
        Endpoints.AcceptenceTestQuestion,
        'form',
        res
      ).subscribe((config: Field[]) => {
        this.answers[res.id] = this.answers[res.id] || [];
        this.questions.splice(index, 1, config);
        this.pictures.set(res.id, []);
      });
    });
  }

  public deleteQuestion(id: string, target: any[], index: number) {
    this.deleteObject(Endpoints.AcceptenceTestQuestion, target, index, id);
  }

  public deleteAnswer(id: string, target: any[], index: number) {
    this.deleteObject(Endpoints.AcceptenceTestAnswers, target, index, id);
  }

  public deleteObject(
    endpoint: string,
    target: any[],
    index: number,
    id: string
  ) {
    if (id) {
      this.genericFormService.delete(endpoint, id).subscribe(() => {
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
      Endpoints.AcceptenceTestAnswers + (update ? data.id + '/' : ''),
      data
    ).subscribe((res) => {
      this.createMetadata(
        Endpoints.AcceptenceTestAnswers,
        'form',
        res
      ).subscribe((config: Field[]) => {
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
    this.modalRef = this.modalService.open(PassTestModalComponent, {
      backdrop: 'static'
    });
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
    button.hidden.next(false);
    field.mode.next('edit');
  }

  public editAnswer(answer) {
    const field = getElementFromMetadata(answer, 'answer');
    const button = getElementFromMetadata(answer, 'button', 'type');
    button.hidden.next(false);
    field.mode.next('edit');
  }

  public onUpload(images: string[], id: string) {
    this.pictureLoading.set(id, true);

    images.forEach((el) => {
      this.genericFormService
        .submitForm('/acceptance-tests/acceptancetestquestionpictures/', {
          acceptance_test_question: { id },
          picture: el
        })
        .pipe(finalize(() => this.pictureLoading.set(id, false)))
        .subscribe((res) => {
          if (this.pictures.has(id)) {
            this.pictures.set(id, [
              ...this.pictures.get(id),
              { id: res.id, src: res.picture.origin }
            ]);
          }
        });
    });
  }

  public onRemovePicture(imageId: string, id: string) {
    this.genericFormService
      .delete('/acceptance-tests/acceptancetestquestionpictures/', imageId)
      .subscribe(() => {
        const pictures = this.pictures.get(id);
        const filteredList = pictures.filter(
          (picture) => picture.id !== imageId
        );

        this.pictures.set(id, [...filteredList]);
      });
  }

  setPictures(data: any): void {
    data.acceptance_test_questions.forEach((question) => {
      this.pictures.set(
        question.id,
        question.pictures.map((el) => {
          return { src: el.picture.origin, id: el.id };
        })
      );
    });
  }
}
