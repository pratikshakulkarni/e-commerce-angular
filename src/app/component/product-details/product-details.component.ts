import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product:Product = new Product();

  constructor(private productservice: ProductService,
              private cartService: CartService,
              private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.handleProductDetails();
    });
  }
  handleProductDetails() {
    //get ID from paramete

    const theId : number =  +this.route.snapshot.paramMap.get("id");
    
    this.productservice.getProduct(theId).subscribe(
      data=>{
        this.product = data;
      }
    )
  }

  addToCart(){
    console.log(`Name = ${this.product.name}, price = ${this.product.unitPrice}`);

    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);

  }

}
