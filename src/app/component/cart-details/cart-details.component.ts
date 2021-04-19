import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems : CartItem[] = [];
  totalPrice: number;
  totalQuantity: number; 

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();    
  }

  listCartDetails(){
    //get handle to cartservice
    this.cartItems = this.cartService.cartIems;

    //subscribe to cartService totalPrice
    this.cartService.totalPrice.subscribe(
      data=> this.totalPrice=data
    );

    //subscribe to cartService totalQuantity
    this.cartService.totalQuantity.subscribe(
      data=>this.totalQuantity=data
    );

    //compute total 
    this.cartService.computeCartTotals();

  }

  incrementQuantity(tempCartItem : CartItem){
    this.cartService.addToCart(tempCartItem);
  }

  decrementQuantity(tempCartItem : CartItem){
    this.cartService.decrementQuantity(tempCartItem);
  }

  remove(tempCartItem: CartItem){
    this.cartService.remove(tempCartItem);
  }

}
