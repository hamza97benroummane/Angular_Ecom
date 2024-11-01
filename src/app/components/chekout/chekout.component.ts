import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ShopFormService} from '../../services/shop-form.service';
import {Country} from '../../common/country';
import {State} from '../../common/state';
import {ShopValidators} from '../../validators/shop-validators';

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

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace,
          Validators.minLength(2),
          Validators.maxLength(20)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20),ShopValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required,ShopValidators.notOnlyWhitespace, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(200),ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), Validators.maxLength(20),ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(200),ShopValidators.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(200),ShopValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20),ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace, Validators.minLength(2), Validators.maxLength(20)]),
        nameOnCard: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace, Validators.minLength(2), Validators.maxLength(20)]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
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



  // populate the countries
  this.shopFormService.getCountries().subscribe(
    data => {
      console.log('Retrieved countries: ' + JSON.stringify(data));
      this.countries = data;
    }
  )


  }

  onSubmit(): void {

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    console.log('handling form submission event');
    console.log(this.checkoutFormGroup.get('customer').get('firstName'));
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log('the chipping address country code: ' + this.checkoutFormGroup.get('shippingAddress').value.country.code);
    console.log('the shipping address state: ' + this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }

  // tslint:disable-next-line:typedef

  // tslint:disable-next-line:typedef
  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {

      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.get('billingAddress').reset();
      this.billingAddressStates = [];
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

  protected readonly Country = Country;

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log('country name: ' + countryName);
    console.log('country code: ' + countryCode);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

  get firstName() {return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}
  get shippingAddressStreet() {return this.checkoutFormGroup.get('shippingAddress.street')}
  get shippingAddressCity() {return this.checkoutFormGroup.get('shippingAddress.city')}
  get shippingAddressState() {return this.checkoutFormGroup.get('shippingAddress.state')}
  get shippingAddressCountry() {return this.checkoutFormGroup.get('shippingAddress.country')}
  get shippingAddressZipCode() {return this.checkoutFormGroup.get('shippingAddress.zipCode')}


  get creditCardType() {return this.checkoutFormGroup.get('creditCard.cardType');}
  get CreditCardNameOnCard() {return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber() {return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode() {return this.checkoutFormGroup.get('creditCard.securityCode');}



}
