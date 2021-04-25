import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormServiceService } from 'src/app/services/form-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  CheckoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  credtCardYears: number[] = [];
  credtCardMonths: number[] = [];

  states:State[]=[];
  countries:Country[]=[];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private formService: FormServiceService) { }

  ngOnInit(): void {
    this.CheckoutFormGroup = this.formBuilder.group({
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
        zip: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zip: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    //get credit card months
    const startMonth = new Date().getMonth() + 1;
    console.log("startMonth = " + startMonth);
    //subscribe to get months
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("All months are :" + JSON.stringify(data));
        this.credtCardMonths = data;
      }
    );

    //get credit card years

    this.formService.getCreditCardYear().subscribe(
      data => {
        console.log("All years = " + JSON.stringify(data));
        this.credtCardYears = data;
      }
    );

    //populate countries
    this.formService.getCountries().subscribe(
      data=>{
        console.log("ALl countries: " + JSON.stringify(data));
        this.countries=data; 
      }
    );
  }

  onSubmit() {
    console.log("handling the submit button");
    console.log(this.CheckoutFormGroup.get('customer').value);
  }

  copyShippingToBilling(event) {

    if (event.target.checked) {
      this.CheckoutFormGroup.controls.billingAddress
        .setValue(this.CheckoutFormGroup.controls.shippingAddress.value);

        this.billingAddressStates = this.shippingAddressStates;
    }

    else {
      this.CheckoutFormGroup.controls.billingAddress.reset();

      this.billingAddressStates=[];
    }
  }

  handleMonthsAndYears(){
    const currentYear:number = new Date().getFullYear()+1;
    const creditCardFormGroup=this.CheckoutFormGroup.get('creditCard');
    const selectedYear:number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;
    
    if(currentYear == selectedYear){
      startMonth = new Date().getMonth()+1;
    }
    else{
      startMonth=1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("credit card moneths : " + JSON.stringify(data))
        this.credtCardMonths=data;
      }
    );
  }

  getStates(formGroupName:string){

    console.log("In getStates");
    

    const formGroup = this.CheckoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`{formGroupName} Country Code : ${countryCode}`);
    console.log(`{formGroupName} Country Name : ${countryName}`);
    
    this.formService.getStates(countryCode).subscribe(
      data => {

        if(formGroupName == 'shippingAddress'){
          this.shippingAddressStates=data;
        }
        else{
          this.billingAddressStates=data;
        }

        //Default state
        formGroup.get('state').setValue(data[0]);
      }
    );

  }

}
