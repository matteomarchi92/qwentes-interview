import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackButtonService } from 'src/app/services/back-button.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  backButton: any;

  constructor(
    public router: Router,
    public backButtonService: BackButtonService
  ) { 
    this.backButtonService.backButton.subscribe(value => this.backButton = value)
  }

  ngOnInit(): void {
  }

  onLogout() {
    localStorage.setItem('token', '')
    this.router.navigate(['/login']);
  }

}
