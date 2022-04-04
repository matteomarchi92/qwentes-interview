import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error-card',
  templateUrl: './error-card.component.html',
  styleUrls: ['./error-card.component.scss']
})
export class ErrorCardComponent implements OnInit {

  @Input() errorData: any;

  constructor(
  ) { }

  ngOnInit(): void {

    if (this.errorData == null) { this.errorData = { status: 500, message: 'Internal server error'}; }
  }

  ngOnDestroy(): void { }

}

