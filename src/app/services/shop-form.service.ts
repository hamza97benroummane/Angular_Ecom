import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Country} from '../common/country';
import {map} from 'rxjs/operators';
import {State} from '../common/state';




@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';
  constructor(private httpClient: HttpClient ) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(TheCountryCode: string): Observable<State[]> {
    const searchStateUrl = `${this.statesUrl}/search/findByCountryCode?code=${TheCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
      map(response => response._embedded.states)
    );
  }


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

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}
