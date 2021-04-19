import { Product } from "./product";

export class CartItem {

    //fields of products
    id: string;
    imageUrl: string;
    name: string;
    unitsPrice: number;
    quantity: number

    constructor(product:Product){
        this.id=product.id;
        this.imageUrl=product.imageUrl;
        this.name=product.name;
        this.unitsPrice=product.unitPrice;

        this.quantity =1;
    }
}
