import { Injectable } from '@angular/core';
import {CartItem} from '../common/cart-item';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  // tslint:disable-next-line:typedef
  addToCart(theCartItem: CartItem) {
    let alreadyExistsInCart = false;
    let existingCartItem: CartItem;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // check if item already exists in cart
      // tslint:disable-next-line:triple-equals
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  // tslint:disable-next-line:typedef
  computeCartTotals() {

    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (const currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  // tslint:disable-next-line:typedef
  private logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Content of the cart');
    for (const tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)},totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }

  // tslint:disable-next-line:typedef
  decreaseQuantity(temp: CartItem) {
    temp.quantity--;
    if (temp.quantity === 0) {
      this.remove(temp);
    } else {
      this.computeCartTotals();
    }
  }

  // tslint:disable-next-line:typedef
  remove(temp: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === temp.id);
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
