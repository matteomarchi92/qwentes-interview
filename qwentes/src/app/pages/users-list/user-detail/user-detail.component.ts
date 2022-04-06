import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, retryWhen } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { BackButtonService } from 'src/app/services/back-button.service';
import { CardTitleService } from 'src/app/services/card-title.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {

  public loadingData: any;
  public errorData: any;
  public user: any;
  public userId: any;
  public userPosts: any;
  public userForm: FormGroup;

  public pageState: BehaviorSubject<number> = new BehaviorSubject(1);
  public pageStateReady: number = 3;

  constructor(
    public cardTitleService: CardTitleService,
    public apiService: ApiService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public backButtonService: BackButtonService
  ) {
    this.cardTitleService.set('')
    let backButton = {
      urlPath: ['/users-list'],
      urlQueryParams: null
    }
    this.backButtonService.set(backButton)
  }

  dispatcher() {
    switch (this.pageState.value) {
      case 1:
        this.loadingData = { message: 'Loading User Data...' }
        this.getUserById(this.userId)
        break;
      case 2:
        this.userFormInit()
        break;
      case 3:
        this.loadingData = { message: 'Loading User Posts...' }
        this.getUserPostsById(this.userId)
        break;
      case 4: break;
    }
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let userId = params['userId'];
      if (userId != null) {
        this.userId = userId
        this.pageState.next(1)
        this.dispatcher()
      }
      else this.pageState.next(0)
    });
  }

  ngOnDestroy() {
    this.pageState.unsubscribe()
  }

  getUserById(id) {
    try {
      this.apiService.sendGetRequest('/users/' + id)
        .pipe(
          retryWhen(this.apiService.genericRetryStrategy()),
          catchError(error => {
            console.log((error.error instanceof ErrorEvent) ? error.error.message : error.message);
            let errorData = {
              type: 0,
              status: error.status,
              message: error.message
            };
            this.errorData = errorData
            this.pageState.next(0)
            return throwError(errorData.status + ': ' + errorData.message);
          })
        )
        .subscribe(
          (data: any) => {
            if (data.body != null) {
              this.user = data.body
              let name = this.user?.name ?? 'Unknown User'
              this.cardTitleService.set(name)
              this.pageState.next(2)
              this.dispatcher()
            } else {
              this.pageState.next(0)
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
      this.pageState.next(0)
    }
  }

  userFormInit() {
    this.userForm = new FormGroup({
      name: new FormControl(this.user?.name, [
        Validators.minLength(6),
        Validators.required
      ]),
      email: new FormControl(this.user?.email, [
        Validators.required,
        Validators.email
      ]),
      companyName: new FormControl(this.user?.company?.name ?? '')
    })
    this.pageState.next(3)
    this.dispatcher()
  }

  get email() { return this.userForm.get('email'); }
  get name() { return this.userForm.get('name'); }
  get companyName() { return this.userForm.get('companyName'); }

  getUserPostsById(id) {
    let query = {
      userId: id
    }

    try {
      this.apiService.sendGetRequest('/posts', query)
        .pipe(
          retryWhen(this.apiService.genericRetryStrategy()),
          catchError(error => {
            console.log((error.error instanceof ErrorEvent) ? error.error.message : error.message);
            let errorData = {
              type: 0,
              status: error.status,
              message: error.message
            };
            this.errorData = errorData
            this.pageState.next(0)
            return throwError(errorData.status + ': ' + errorData.message);
          })
        )
        .subscribe(
          (data: any) => {
            if (data.body != null && Array.isArray(data.body)) {
              this.userPosts = this.parseUserPosts(data.body)
              this.pageState.next(4)
              this.dispatcher()
            } else {
              this.pageState.next(0)
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
      this.pageState.next(0)
    }
  }

  parseUserPosts(data) {
    data = JSON.parse(JSON.stringify(data))
    data.forEach((element: any) => {
      element.urlPath = ["/" + 'posts-list', 'post-detail'];
      element.urlQueryParams = { userId: element.userId, postId: element.id };
    })
    return data
  }

  onSaveUser() {
    let payload = {
      name: this.userForm.controls?.name?.value,
      email: this.userForm.controls?.email?.value,
      company: {
        name: this.userForm.controls?.companyName?.value ?? ''
      }
    }
    console.log(payload)
    this.loadingData = { message: 'Waiting Server Response...' }
    this.pageState.next(1)
    this.upsertUser(payload)
  }

  upsertUser(payload) {

    let headers = {
      'Content-type': 'application/json; charset=UTF-8',
    }
    try {
      this.apiService.sendPatchRequest('/users/'+this.userId, payload, null, headers)
        .pipe(
          retryWhen(this.apiService.genericRetryStrategy()),
          catchError(error => {
            console.log((error.error instanceof ErrorEvent) ? error.error.message : error.message);
            let errorData = {
              type: 0,
              status: error.status,
              message: error.message
            };
            this.errorData = errorData
            this.pageState.next(0)
            return throwError(errorData.status + ': ' + errorData.message);
          })
        )
        .subscribe(
          (data: any) => {
            this.dispatcher()
          },
        );

    } catch (error) {
      let errorData = {
        type: 0,
        status: 500,
        message: (error.error instanceof ErrorEvent) ? error.error.message : error.message
      };
      this.errorData = errorData
      this.pageState.next(0)
    }
  }

  navigateFromPost(post) { 
    if (post?.urlPath != null) {
      let backButton = {
        urlPath: ['/users-list','user-detail'],
        urlQueryParams: {
          userId: this.userId
        }
      }
      this.backButtonService.set(backButton)
      this.router.navigate(post.urlPath, { queryParams: post?.urlQueryParams }) 
    }
  }
}
