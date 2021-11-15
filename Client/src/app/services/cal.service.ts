import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export class Expression {
  constructor(
    public firstOperand: string,
    public operator: string,
    public secondOperand: string
  ) { }
}

export class SingleParameter {
  constructor(
    public expression: string
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class CalService {

  constructor(private httpClient: HttpClient) { }

  calculatorURL: string = "http://localhost:8080/";

  sendRequestBasic(expression: Expression): Observable<HttpResponse<Expression>> {
    return this.httpClient.post<Expression>(this.calculatorURL + "Basic", expression, {
      observe: 'response'
    }
    )
  }

  sendRequestSingle(expression: string): Observable<HttpResponse<string>> {
    return this.httpClient.post<string>(this.calculatorURL + "Single", expression, {
      observe: 'response',
      params: { expression } // 500 
    })
  }

}

/*
  return this.httpClient.post(this.calculatorURL, expression || null).subscribe(
    (response) => {
      console.warn(response);
      return response;
    }, 
    (error) => {
      console.error(error);
    });
*/
