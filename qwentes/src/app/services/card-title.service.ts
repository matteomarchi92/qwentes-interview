import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardTitleService {
  private cardTitleSource: BehaviorSubject<any> = new BehaviorSubject(String);
  cardTitle = this.cardTitleSource.asObservable();

  constructor() { }
  
  set(cardTitle) {
    this.cardTitleSource.next(cardTitle)
  }
}
