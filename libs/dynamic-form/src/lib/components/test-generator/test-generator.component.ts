import { CdkStepper } from '@angular/cdk/stepper';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckboxType, Form, InputType } from '@webui/metadata';

import { GenericFormService } from '../../services/generic-form.service';

enum QuestionType {
  Options,
  Text,
  YesNo,
  Checkboxes
}

@Component({
  selector: 'app-test-generator',
  templateUrl: './test-generator.component.html',
  styleUrls: ['./test-generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestGeneratorComponent implements OnInit {
  @Input() public id: string;
  @Input() public send = true;
  @Input() public workflowObject: string;
  @Input() test: any;
  @Input() skipScore: boolean;

  @ViewChild('cdkStepper') stepper: CdkStepper;

  @Output() public sended: EventEmitter<any> = new EventEmitter();

  public testEndpoint = '/acceptance-tests/acceptancetests/';
  public answerEndpoint = '/acceptance-tests/workflowobjectanswers/';
  public testData: any;
  public form: FormGroup = new FormGroup({});

  QuestionType = QuestionType;

  constructor(
    private genericFormService: GenericFormService,
    private cd: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.fetchTest();
  }

  public generateTestForm(data: any) {
    this.testData = {
      name: data.test_name,
      description: data.description,
      questions: []
    };

    data.acceptance_test_questions.forEach((question) => {
      this.testData.questions.push(this.generateQuestion(question));
    });

    this.testData.questions.sort((p, n) => (p.order > n.order ? 1 : -1));
    this.cd.detectChanges();
  }

  public generateQuestion(data: any) {
    this.form.addControl(data.id, new FormGroup({}));
    let answerOptions;

    const question: { [key: string]: any } = {
      acceptance_test_question: data.id,
      name: data.question,
      details: data.details,
      type: data.type,
      order: data.order,
      workflow_object: this.workflowObject,
      group: this.form.get(data.id),
      pictures: data.pictures.map((el) => el.picture.origin)
    };

    if (data.type !== QuestionType.Text) {
      answerOptions = data.acceptance_test_answers.map((el) => {
        if (el) {
          return {
            label: el.answer,
            value: el.id
          };
        }
      });

      (this.form.get(data.id) as FormGroup).addControl(
        'answer',
        new FormControl('', Validators.required)
      );
      question.answerMetadata = this.getAnswerMetadata(
        data.type,
        answerOptions
      );
    }

    if (question.type === QuestionType.Text) {
      question.answerMetadata = this.getAnswerMetadata(data.type);
      question.scoreMetadata = new Form.input.element(
        'score',
        'Score',
        InputType.Number
      );
    }

    return question;
  }

  public sendForm() {
    const formValue = this.form.value;
    const body = this.testData.questions.map((question) => {
      const value = formValue[question.acceptance_test_question];
      let answer = value.answer;

      if (question.type === QuestionType.Checkboxes) {
        answer = Object.entries(value)
          .filter(([_, value]) => value)
          .map(([key]) => key);
      }

      return {
        acceptance_test_question: question.acceptance_test_question,
        workflow_object: question.workflow_object,
        answer,
        answer_text: value.answer_text,
        score: this.skipScore && value.answer_text ? 5 : value.score
      };
    });

    if (this.send) {
      this.genericFormService
        .submitForm(this.answerEndpoint, body)
        .subscribe(() => {
          this.sended.emit(true);
        });
    } else {
      this.sended.emit(body);
    }
  }

  back() {
    this.stepper.previous();
  }

  next() {
    this.stepper.next();
  }

  private getAnswerMetadata(type: QuestionType, options?: any) {
    switch (type) {
      case QuestionType.Text: {
        return new Form.textarea.element('answer_text', '').setFullWidth();
      }

      case QuestionType.Checkboxes: {
        return new Form.group.element('', '').doNotShowLabel().setChildren(
          options.map((option: { label: string; value: string }) => {
            return new Form.checkbox.element(
              option.value,
              option.label,
              CheckboxType.Checkbox
            );
          })
        );
      }

      case QuestionType.Options:
      case QuestionType.YesNo: {
        return {
          key: 'answer',
          options
        };
      }
    }
  }

  private fetchTest(): void {
    if (this.test) {
      this.generateTestForm(this.test);
    } else {
      this.genericFormService
        .getAll(`${this.testEndpoint}${this.id}/`)
        .subscribe((res) => {
          this.generateTestForm(res);
        });
    }
  }
}
