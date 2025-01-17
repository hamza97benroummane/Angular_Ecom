import { Component, OnInit } from '@angular/core';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../common/cart-item';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice = 0;
  totalQuantity = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  // tslint:disable-next-line:typedef
  private listCartDetails() {

    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    this.cartService.computeCartTotals();
  }

  // tslint:disable-next-line:typedef
  increaseQuantity(temp: CartItem) {
    this.cartService.addToCart(temp);

    this.cartService.computeCartTotals();
  }

  // tslint:disable-next-line:typedef
  decreaseQuantity(temp: CartItem) {
    this.cartService.decreaseQuantity(temp);

    this.cartService.computeCartTotals();
  }

  // tslint:disable-next-line:typedef
  remove(temp: CartItem) {
    this.cartService.remove(temp);

    this.cartService.computeCartTotals();
  }
}
