import { Component, OnInit } from '@angular/core';
import { CardTitleService } from 'src/app/services/card-title.service';

@Component({
  selector: 'app-card-title',
  templateUrl: './card-title.component.html',
  styleUrls: ['./card-title.component.scss']
})
export class CardTitleComponent implements OnInit {
  cardTitle = ''

  constructor(
    public cardTitleService: CardTitleService
  ) { 
    this.cardTitleService.cardTitle.subscribe((value) => this.cardTitle = value)
  }

  ngOnInit(): void {
  }

}
