import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
} from '@angular/core';

import { BillingService } from '../../services/billing-service';
import { environment } from '../../../../environments/environment';

const style = {
  base: {
    'color': '#32325d',
    'lineHeight': '18px',
    'fontFamily': '"Helvetica Neue", Helvetica, sans-serif',
    'fontSmoothing': 'antialiased',
    'fontSize': '16px',
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
  selector: 'app-check-card',
  templateUrl: './check-card.component.html',
  styleUrls: ['./check-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckCardComponent implements OnInit {

  public error: string;
  public saving: boolean;
  public newCard: boolean;

  @Input()
  public cardExist: boolean;

  private stripe: any;
  private card: any;

  constructor(
    private billingService: BillingService
  ) {}

  public ngOnInit() {
    this.billingService.getStripeKey().subscribe((res) => {
      const key = (res as any).public_key;

      this.stripe = (<any> window).Stripe(key);
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
    if (this.cardExist) {
      this.billingService.changeCard({
        source: token
      }).subscribe(() => {
        this.saving = false;
        this.cardExist = true;
        this.newCard = false;
      });
    } else {
      this.billingService.setCardInfo({
        source: token
      }).subscribe(() => {
        this.saving = false;
        this.cardExist = true;
        this.newCard = false;
      });
    }

  }

  public showCardForm() {
    this.newCard = true;
  }

}
