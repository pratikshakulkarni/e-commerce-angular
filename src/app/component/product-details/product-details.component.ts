import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product:Product = new Product();

  constructor(private productservice: ProductService,
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

}
