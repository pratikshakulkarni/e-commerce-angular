import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartIems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem) {

    //check if item in cart already exists
    let itemAlreadyExistInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    existingCartItem = this.cartIems.find(tempCartItem => tempCartItem.id === cartItem.id);

    //check if we found it
    itemAlreadyExistInCart = (existingCartItem != undefined);
    

    if (itemAlreadyExistInCart) {
      existingCartItem.quantity++;
    }
    else {
      this.cartIems.push(cartItem);
    }

    this.computeCartTotals();
  }
  computeCartTotals() {
    
    let totalPriceValue : number =0;
    let totalQuantityValue: number =0;

    for(let currentCartItem of this.cartIems){
      totalPriceValue += currentCartItem.quantity*currentCartItem.unitsPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalQuantityValue,totalPriceValue);
  }
  logCartData(totalQuantityValue: number, totalPriceValue: number) {
    
    for(let tempItem of this.cartIems){
      const subTotalQuantity = tempItem.quantity*tempItem.unitsPrice;
      console.log(`name ${tempItem.name}, quantity ${tempItem.quantity}, price ${tempItem.unitsPrice}, Total ${subTotalQuantity}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue.toFixed(2)}`);
    console.log("-------------");
    
    
  }

  decrementQuantity(tempCartItem: CartItem) {
    tempCartItem.quantity--;

    if(tempCartItem.quantity === 0){
      this.remove(tempCartItem)
    }
    else{
      this.computeCartTotals();
    }
  }

  remove(deleteCartItem : CartItem){

    //get the index of deleted item
    const itemIndex = this.cartIems.findIndex( tempCartItem=> tempCartItem.id === deleteCartItem.id);

    //if found delete it
    if(itemIndex > -1){
      this.cartIems.splice(itemIndex,1);

      this.computeCartTotals();
    }

  }

}
