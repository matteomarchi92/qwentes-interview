import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, retryWhen } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { BackButtonService } from 'src/app/services/back-button.service';
import { CardTitleService } from 'src/app/services/card-title.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  public pageState = 0
  public loadingData: any;
  public errorData: any;
  public users: any;

  constructor(
    public cardTitleService: CardTitleService,
    public apiService: ApiService,
    public router: Router,
    public backButtonService: BackButtonService
  ) {
    this.cardTitleService.set('CONTACTS')
    this.loadingData = { message: 'Loading Users...'}
    this.backButtonService.set(null)
  }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    try {
      this.apiService.sendGetRequest('/users')
        .pipe(
          retryWhen(this.apiService.genericRetryStrategy()),
          catchError(error => {
            console.log((error.error instanceof ErrorEvent) ? error.error.message : error.message);
            let errorData = {
              type: 0,
              status: error.status,
              message: error.statusText
            };
            this.errorData = errorData
            this.pageState = 2
            return throwError(errorData.status + ': ' + errorData.message);
          })
        )
        .subscribe(
          (data: any) => {
            if (data.body != null && Array.isArray(data.body)) {
              if(data.body.length == 1) this.loadingData.message = 'No data Available'
              this.users = this.parseUsers(data.body)
              this.pageState = 1
            } else {
              this.pageState = 2
            }
          },
        );

    } catch (error) {
      let errorData = {
        type: 0,
        status: 500,
        message: (error.error instanceof ErrorEvent) ? error.error.message : error.message
      };
      this.errorData = errorData
      this.pageState = 2
    }
  }

  parseUsers(data) {
    data = JSON.parse(JSON.stringify(data))
    data.forEach((element: any) => {
      element.urlPath = ["/" + 'users-list', 'user-detail'];
      element.urlQueryParams = { userId: element.id };
    })
    return data
  }

  navigateFromUser(user) { 
    if (user?.urlPath != null) {
      this.router.navigate(user.urlPath, { queryParams: user?.urlQueryParams }) 
    }
  }

}
