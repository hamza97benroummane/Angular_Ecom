import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../common/product';
import {ActivatedRoute} from '@angular/router';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId = 1;
  private previousCategoryId = 1;
  SearchMode = false;

  thePageNumber = 1;
  thePageSize = 5;
  theTotalElements = 0;

  previousKeyword: string = null;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  // tslint:disable-next-line:typedef
  listProducts() {
    // this.handleSearchProducts();
    this.SearchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.SearchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }
  // tslint:disable-next-line:typedef
  private handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // tslint:disable-next-line:triple-equals
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    this.productService.SearchProductsPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
  }

  // tslint:disable-next-line:typedef
  handleListProducts() {

    // check if "id" param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get id param string and convert to number using "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      // not category id available default is 1
      this.currentCategoryId = 1;
    }

    // check if we have a category id then get the products for this category
    // else get all products
    // if no id provided get all products
    // tslint:disable-next-line:triple-equals
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    // console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    this.productService.getProductListPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId
      ).subscribe(this.processResult());

  }

  // tslint:disable-next-line:typedef
  private processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  // tslint:disable-next-line:typedef
  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  // tslint:disable-next-line:typedef
  addToCart(theProduct: Product) {
    console.log(`Product added to Cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
