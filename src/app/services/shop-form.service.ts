import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  constructor() { }

  // tslint:disable-next-line:ban-types
  getCreditCardMonths(startMonth: number): Observable<Number[]> {

    // tslint:disable-next-line:ban-types
    const data: Number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  // tslint:disable-next-line:ban-types
  getCreditCardYears(): Observable<Number[]> {
    // tslint:disable-next-line:ban-types
    const data: Number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let theYear = startYear; theYear <= endYear; theYear++) {
        data.push(theYear);
    }
    return of(data);
  }

}
