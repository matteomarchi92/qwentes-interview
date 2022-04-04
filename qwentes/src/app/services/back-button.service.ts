import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackButtonService {
  private backButtonSource: BehaviorSubject<any> = new BehaviorSubject(null);
  backButton = this.backButtonSource.asObservable();

  constructor() { }
  
  set(backButton) {
    this.backButtonSource.next(backButton)
  }

  get() {
    let backButton = this.backButtonSource.value
    return backButton
  }
}
