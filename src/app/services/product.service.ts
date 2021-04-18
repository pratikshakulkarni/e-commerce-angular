import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private baseUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category";

  constructor(private httpClient: HttpClient) { }

  getProduct(theId: number): Observable<Product> {
    
    const productUrl = `${this.baseUrl}/${theId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {

    //Need to create new url for ID
    const searcUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searcUrl);

  }

  //Pagination
  getProductListPaginate(thePage:number,
                        pageSize:number,
                        theCategoryId: number): Observable<GetResponseProducts> {

    //Need to create new url for ID
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    +`&page=${thePage}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }


  searchKeywordProducts(theKeyword: string): Observable<Product[]> {
    //Need to create new url for ID
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);

  }

    searchProductListPaginate(thePage:number,
                        pageSize:number,
                        theKeyword: string): Observable<GetResponseProducts> {

    //Need to create new url for ID
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    +`&page=${thePage}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  private getProducts(searcUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searcUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );


  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
