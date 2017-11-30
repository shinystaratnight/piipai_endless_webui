import { TestBed, async, inject } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ErrorsService } from './errors.service';

describe('ErrorsService', () => {
    let service;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ErrorsService]
      });
    });

    describe('parseResponse method', () => {
      it('should add new error message', async(inject([ErrorsService], (es: ErrorsService) => {
        let errors = {
          status: 'error',
          errors: {
            detail: 'Some error'
          }
        };
        let responseObject = new ResponseOptions({
          body: JSON.stringify(errors)
        });
        let error;
        let resultMessage;
        let mockError = new Response(responseObject);
        es.messages.subscribe((message: any) => {
          resultMessage = message;
        });
        es.parseErrors(mockError).subscribe(null,
          (err: any) => error = err
        );
        expect(error).toEqual(errors);
        expect(resultMessage).toEqual('');
      })));
    });

});
