import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  @Output() public sended: EventEmitter<any> = new EventEmitter();

  public testEndpoint = '/acceptance-tests/acceptancetests/';
  public answerEndpoint = '/acceptance-tests/workflowobjectanswers/';
  public testData: any;
  public form: FormGroup;

  public currentQuestion = 0;
  reload: boolean;
  QuestionType = QuestionType;

  constructor(
    private genericFormService: GenericFormService,
    private cd: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.form = new FormGroup({});

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

    if (data.type !== QuestionType.Text) {
      answerOptions = data.acceptance_test_answers.map((el) => {
        if (el) {
          return {
            label: el.answer,
            value: el.id
          };
        }
      });
    }

    const question = {
      acceptance_test_question: data.id,
      name: data.question,
      details: data.details,
      type: data.type,
      order: data.order,
      workflow_object: this.workflowObject,
      answerMetadata: this.getAnswerMetadata(data.type, answerOptions),
      group: this.form.get(data.id),
      pictures: data.pictures.map((el) => el.picture.origin)
    };

    if (question.type === QuestionType.Text) {
      question['scoreMetadata'] = new Form.input.element('score', 'Score', InputType.Number);
    }

    return question;
  }

  public sendForm() {
    const formValue = this.form.value;
    const body = this.testData.questions.map((question) => {
      const value = formValue[question.acceptance_test_question];
      let answer = value.answer;

      if (question.type === QuestionType.Checkboxes) {
        answer = Object.entries(value).filter(([_, value]) => value).map(([key]) => key);
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

  getOptionsMetadata(options: { value: string; label: string }) {
    return {
      type: 'radio',
      key: 'answer',
      templateOptions: {
        type: 'text',
        column: true,
        options
      }
    };
  }

  back() {
    this.reload = true;
    if (this.currentQuestion !== 0) {
      this.reload = true;
      setTimeout(() => {
        this.reload = false;
        this.currentQuestion -= 1;
        this.cd.detectChanges();
      }, 400);
    }
  }

  next() {
    this.reload = true;
    setTimeout(() => {
      this.reload = false;
      this.currentQuestion += 1;
      this.cd.detectChanges();
    }, 400);
  }

  private getAnswerMetadata(type: QuestionType, options?: any) {
    switch (type) {
      case QuestionType.Text: {
        return new Form.textarea.element('answer_text', '').setFullWidth();
      }

      case QuestionType.Checkboxes: {
        return new Form.group.element('', '')
          .doNotShowLabel()
          .setChildren(options.map((option: { label: string; value: string }) => {
            return new Form.checkbox.element(option.value, option.label, CheckboxType.Checkbox)
          }));
      }

      case QuestionType.Options:
      case QuestionType.YesNo: {
        return this.getOptionsMetadata(options);
      }
    }
  }

}
