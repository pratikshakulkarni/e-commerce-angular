import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list-table.component.html',
  //templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  searchMode: boolean;

  constructor(private productService: ProductService,
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

    this.productService.searchKeywordProducts(theKeyword).subscribe(
      data=>{
        this.products=data;
      }
    );

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

    //get the products using category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }


}
