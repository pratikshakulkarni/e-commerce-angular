import { KeyedWrite } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list-table.component.html',
  //templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //Pagination properties
  pageNumber : number = 1;
  pageSize : number = 5;
  totalElements : number = 0;

  previousKeyword : string = null;


  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }

  }
  handleSearchProducts() {
    
    const theKeyword = this.route.snapshot.paramMap.get('keyword');

    //search for products using keywords 

    //If we have diff. keyword than previous 
    //set pageNumber to 1

    if(this.previousKeyword !=theKeyword){
      this.pageNumber=1;
    }

    this.previousKeyword=theKeyword;

    console.log(`keyowrd=${theKeyword} pageNumber = ${this.pageNumber}`);
    

    this.productService.searchProductListPaginate(this.pageNumber-1,
                                                  this.pageSize,
                                                  theKeyword).subscribe(this.processResult())

  }

  handleListProducts() {

    //Check if id param is available else default;
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //Read and convert it into number using  '+' symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      //if not available set default
      this.currentCategoryId = 1
    }

    /*
    1. Check if you different category ID than the previous one
    2. Angular will reuse the component if it currently being viewed.
    */

    //If we have diff. category ID than the previous one,
    //set the pageNumber to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.pageNumber=1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`the current category id = ${this.currentCategoryId} page number = ${this.pageNumber}`);
    
    //get the products using category id
    this.productService.getProductListPaginate(this.pageNumber - 1,
                                              this.pageSize,
                                              this.currentCategoryId)
                                              .subscribe(this.processResult());
  }
  processResult() {
    return data => {
        this.products = data._embedded.products;
        this.pageNumber = data.page.number + 1;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements
    }
  }

  updatePageSize(pageSize:number){
    this.pageSize=pageSize;
    this.pageNumber=1;
    this.listProducts();
  }

  addToCart(product: Product){

    console.log(`Adding to cart ${product.name},  ${product.unitPrice}`);

    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
    
  }


}
