import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Inject,
  Optional,
  Output,
  EventEmitter,
} from '@angular/core';

import { BillingService } from '../../services/billing-service';
import { ENV } from '@webui/core';

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
  selector: 'webui-check-card',
  templateUrl: './check-card.component.html',
  styleUrls: ['./check-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckCardComponent implements OnInit {

  public error!: string;
  public saving!: boolean;
  public newCard!: boolean;

  @Input()
  public cardInformation?: {
    payment_information_submited: true;
    card_number_last4: null | string;
  };

  @Output()
  public cardChange = new EventEmitter();

  private stripe: any;
  private card: any;

  constructor(
    private billingService: BillingService,
    @Optional() @Inject(ENV) private env: any
  ) {}

  public ngOnInit() {
    this.billingService.getStripeKey().subscribe((res) => {
      const key = (res as any).public_key;

      this.stripe = (<any> window).Stripe(key);
      const elements = this.stripe.elements();
      this.card = elements.create('card', { style });
      this.card.mount('#card-element');

      this.card.addEventListener('change', (event: any) => {
        if (event.error) {
          this.error = event.error.message;
        } else {
          this.error = '';
        }
      });

    });
  }

  public checkCard(event: any) {
    event.preventDefault();

    this.saving = true;

    this.stripe.createToken(this.card).then((result: any) => {
      if (result.error) {
        this.error = result.error.message;
        this.saving = false;
      } else {
        console.log(result);
        this.sendToken(result.token.id, result.token.card.last4);
      }
    });
  }

  public sendToken(token: string, last4: string) {
    if (this.cardInformation?.payment_information_submited) {
      this.billingService.changeCard({
        source: token,
        last4,
      }).subscribe(() => {
        this.saving = false;
        this.newCard = false;
        this.cardChange.emit();
      });
    } else {
      this.billingService.setCardInfo({
        source: token,
        last4,
      }).subscribe(() => {
        this.saving = false;
        this.newCard = false;
        this.cardChange.emit();
      });
    }

  }

  public showCardForm() {
    this.newCard = true;
  }

}
