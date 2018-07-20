import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { BillingService } from '../../services/billing-service';
import { environment } from '../../../environment';

const style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

@Component({
  selector: 'check-card',
  templateUrl: './check-card.component.html',
  styleUrls: ['./check-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckCardComponent implements OnInit {

  public error: string;
  public saving: boolean;

  private stripe: any;
  private card: any;

  constructor(
    private billingService: BillingService
  ) {}

  public ngOnInit() {
    this.stripe = (<any> window).Stripe(process.env.STRIPE_PUBLIC_API_KEY || environment.STRIPE_PUBLIC_API_KEY); //tslint:disable-line
    const elements = this.stripe.elements();
    this.card = elements.create('card', { style });
    this.card.mount('#card-element');

    this.card.addEventListener('change', (event) => {
      if (event.error) {
        this.error = event.error.message;
      } else {
        this.error = '';
      }
    });
  }

  public checkCard(event) {
    event.preventDefault();

    this.saving = true;

    this.stripe.createToken(this.card).then((result) => {
      if (result.error) {
        this.error = result.error.message;
        this.saving = false;
      } else {
        this.sendToken(result.token.id);
      }
    });
  }

  public sendToken(token) {
    this.billingService.setCardInfo({
      source: token
    }).subscribe(() => {
      this.saving = false;
    });
  }

}
