import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable, throwError, timer } from 'rxjs';
import { mergeMap} from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private SERVER_URL = 'https://jsonplaceholder.typicode.com';

  constructor(private httpClient: HttpClient, public router: Router) { }

  public sendGetRequest(url: string, params?: any) {

    url = this.SERVER_URL != null && url.startsWith('/') ? this.SERVER_URL + url : url;
    return this.httpClient.get(url, { params: params, observe: "response" })
  }

  public sendPostRequest(url: string, payload: any, params?: any, headers?: any) {

    url = this.SERVER_URL != null && url.startsWith('/') ? this.SERVER_URL + url : url;
    return this.httpClient.post(url, payload, { headers: headers, params: params, observe: "response" })
  }


  // Generic retry: Funziona con input:
  // - maxRetryAttempts: Numero di tentativi prima del fallimento.
  // - scalingDuration:  Tempo di retry cumulato (ogni richiesta aumenta di questa quantità) [ms].
  // - excludedStatusCodes: Codici esclusi dal retry.
  public genericRetryStrategy = (
    {
      maxRetryAttempts = 3,
      scalingDuration = 1000,
      excludedStatusCodes = [-1]
    }: {
      maxRetryAttempts?: number;
      scalingDuration?: number;
      excludedStatusCodes?: number[];
    } = {}
  ) => (attempts: Observable<any>) => {
    return attempts.pipe(
      mergeMap((error, i) => {
        const retryAttempt = i + 1;
        // if maximum number of retries have been met
        // or response is a status code we don't wish to retry, throw error
        if (error.status == 302) {
          this.router.navigateByUrl('/login');
        }
        else if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
          return throwError(error);
        }
        console.log(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration} ms`);
        // retry after 1s, 2s, etc...
        return timer(retryAttempt * scalingDuration);
      }),
      // finalize(() => console.log('We are done!'))
    );
  };
}
