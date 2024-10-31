import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ShopFormService} from '../../services/shop-form.service';

@Component({
  selector: 'app-chekout',
  templateUrl: './chekout.component.html',
  styleUrls: ['./chekout.component.css']
})
export class ChekoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalQuantity = 0;
  totalPrice = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });



    const startMonth = new Date().getMonth() + 1;
    console.log('Start month: ' + startMonth);
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        // this.creditCardMonths = data;
        this.creditCardMonths = data.map(Number);
      }
    );



    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log('Retrieved credit card years: ' + JSON.stringify(data));
        // this.creditCardYears = data;
        this.creditCardYears = data.map(Number);
      }
    );

  }

  onSubmit(): void {
    console.log('handling form submission event');
    console.log(this.checkoutFormGroup.get('customer').get('firstName'));
    console.log(this.checkoutFormGroup.get('customer').value);
  }

  // tslint:disable-next-line:typedef

  // tslint:disable-next-line:typedef
  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      // console.log('shipping address is same as billing address' + this.checkoutFormGroup.get('shippingAddress').value);
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }


  // tslint:disable-next-line:typedef
  handleMonthsAndYears($event: Event) {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
      console.log('retrieved credit card months: ' + JSON.stringify(data));
      this.creditCardMonths = data.map(Number);
    }
    );
  }
}
