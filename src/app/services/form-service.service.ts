import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  private countriesUrl = "http://localhost:8080/api/countries";
  private statesUrl = "http://localhost:8080/api/states";

  constructor(private httpClient:HttpClient) { }

  getCountries(): Observable<Country[]>{

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
    
  }

  getStates(countryCode: string): Observable<State[]>{
    
    const searchStateUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
      map(response => response._embedded.states)
    )

  }

  getCreditCardMonths(startMonth: number) : Observable<number[]>{

    let data: number[] = [];

    //start the month from given start month and loop till 12

    for(let theMonth=startMonth;theMonth<=12;theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYear() : Observable<number[]>{

    let data: number[] = [];

    //start the year from given start year and loop till next 10 years

    const startYear:number = new Date().getFullYear();
    const endYear:number = startYear+10;

    for(let theYear=startYear;theYear<=endYear;theYear++){
      data.push(theYear);
    }
    return of(data);
  }
  
}

interface GetResponseCountries{
  _embedded:{
    countries:Country[];
  }
}

interface GetResponseStates{
  _embedded:{
    states:State[];
  }
}
