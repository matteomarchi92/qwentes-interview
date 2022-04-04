import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading-card',
  templateUrl: './loading-card.component.html',
  styleUrls: ['./loading-card.component.scss']
})
export class LoadingCardComponent implements OnInit {

  @Input() loadingData: any;

  constructor(
  ) { }

  ngOnInit(): void {

    if (this.loadingData == null) { this.loadingData = { message: 'Loading...'}; }
  }

  ngOnDestroy(): void { }

}
