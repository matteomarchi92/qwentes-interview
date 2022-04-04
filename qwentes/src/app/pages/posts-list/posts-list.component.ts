import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, retryWhen } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { BackButtonService } from 'src/app/services/back-button.service';
import { CardTitleService } from 'src/app/services/card-title.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {
  public pageState = 0
  public loadingData: any;
  public errorData: any;
  public posts: any;

  constructor(
    public cardTitleService: CardTitleService,
    public apiService: ApiService,
    public router: Router,
    public backButtonService: BackButtonService
  ) {
    this.cardTitleService.set('POSTS')
    this.loadingData = { message: 'Loading Posts...'}
    this.backButtonService.set(null)
  }

  ngOnInit(): void {
    this.getPosts()
  }

  getPosts() {
    try {
      this.apiService.sendGetRequest('/posts')
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
              this.posts = this.parsePosts(data.body)
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

  parsePosts(data) {
    data = JSON.parse(JSON.stringify(data))
    data.forEach((element: any) => {
      element.urlPath = ["/" + 'posts-list', 'post-detail'];
      element.urlQueryParams = { userId: element.userId, postId: element.id };
    })
    return data
  }

  navigateFromPost(post) { 
    if (post?.urlPath != null) {
      let backButton = {
        urlPath: ['/posts-list'],
        urlQueryParams: null
      }
      this.backButtonService.set(backButton)
      this.router.navigate(post.urlPath, { queryParams: post?.urlQueryParams }) 
    }
  }

}
