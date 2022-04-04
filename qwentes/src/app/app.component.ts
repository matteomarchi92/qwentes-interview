import { Component } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Qwentes';
  public cardTitle = 'TITLE';
  public appInfo: any;
  public appName = "Qwentes";
  public isMobile: boolean;

  constructor(
    private titleService: Title,
  ) {

    this.setTitle(this.appName);
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
