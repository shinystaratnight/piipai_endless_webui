import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html'
})

export class HomeComponent implements OnDestroy {
  public modalRef: any;
  public modalInfo: any;

  @ViewChild('mobileLoginTemplate')
  public mobileLoginTemplate: any;

  constructor(
    private modalService: NgbModal,
  ) {}

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public mobileLogin() {
    this.modalInfo = {
      label: 'Please, enter a mobile phone',
      endpoint: '/ecore/api/v2/auth/login/',
      data: {
        password: {
          action: 'add',
          data: {
            hide: true,
            templateOptions: {
              label: ''
            }
          }
        },
        username: {
          action: 'add',
          data: {
            templateOptions: {
              label: '',
              placeholder: 'Enter your phone',
              max: 255,
              required: true,
              type: 'text'
            }
          }
        }
      }
    };
    this.modalRef = this.modalService.open(this.mobileLoginTemplate);
  }

  public formEvent(e, closeModal) {
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
    }
  }

}
