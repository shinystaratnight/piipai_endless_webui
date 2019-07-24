import { TestBed, async, inject } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';

import { ErrorsService } from './errors.service';

describe('ErrorsService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ErrorsService]
      });
    });

    describe('parseResponse method', () => {
      it('should add new error message', async(inject([ErrorsService], (es: ErrorsService) => {
        const errors = {
          status: 'error',
          errors: {
            detail: 'Some error'
          }
        };
        const responseObject = new ResponseOptions({
          body: JSON.stringify(errors)
        });
        let error;
        const mockError = new Response(responseObject);
        es.parseErrors(mockError).subscribe(null,
          (err: any) => error = err
        );
        expect(error).toEqual(errors);
      })));
    });

});
