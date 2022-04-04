import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, retryWhen } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { BackButtonService } from 'src/app/services/back-button.service';
import { CardTitleService } from 'src/app/services/card-title.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  public loadingData: any;
  public errorData: any;
  public user: any;
  public userId: any;
  public post: any;
  public postId: any;
  public comments: any;

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

    let backButton = this.backButtonService.get()
    if (backButton==null) {
      let backButton = {
        urlPath: ['/posts-list'],
        urlQueryParams: null
      }
      this.backButtonService.set(backButton)
    }
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let userId = params['userId'];
      let postId = params['postId']
      if (userId != null && postId != null) {
        this.userId = userId
        this.postId = postId
        this.pageState.next(1)
        this.dispatcher()
      }
      else this.pageState.next(0)
    });
  }

  ngOnDestroy() {
    this.pageState.unsubscribe()
  }

  dispatcher() {
    switch (this.pageState.value) {
      case 1:
        this.loadingData = { message: 'Loading Post...' }
        this.getPostById(this.postId)
        break;
      case 2:
        this.loadingData = { message: 'Loading User Data...' }
        this.getUserById(this.userId)
        break;
      case 3:
        this.loadingData = { message: 'Loading Post Comments...' }
        this.getCommentsByPostId(this.postId)
        break;
      case 4: break;
    }
  }

  getPostById(postId) {
    try {
      this.apiService.sendGetRequest('/posts/' + postId)
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
              this.post = data.body
              let title = this.post?.title ?? 'Unknown Post'
              this.cardTitleService.set(title)
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

  getUserById(userId) {
    try {
      this.apiService.sendGetRequest('/users/' + userId)
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
              this.pageState.next(3)
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

  getCommentsByPostId(postId) {
    let query = {
      postId: postId
    }
    try {
      this.apiService.sendGetRequest('/comments', query)
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
              this.comments = data.body
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

}
