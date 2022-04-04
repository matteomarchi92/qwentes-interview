import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from './pages/login/login.component';
import { PostDetailComponent } from './pages/posts-list/post-detail/post-detail.component';
import { PostsListComponent } from './pages/posts-list/posts-list.component';
import { UserDetailComponent } from './pages/users-list/user-detail/user-detail.component';
import { UsersListComponent } from './pages/users-list/users-list.component';

interface CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
 
    constructor(private _router:Router ) {
    }
 
    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): boolean {
        let conditions = true
        let userTokenStr = localStorage.getItem('token')  
        let userToken = null
        try {
          userToken = JSON.parse(userTokenStr)
        } catch (error) {
          alert('You are not allowed to view this page');
          this._router.navigate(['/'])
          return false
        }
        if (userToken==null || (userToken!=null && Object.values(userToken).some(value => !value)))  {
            alert('You are not allowed to view this page');
            this._router.navigate(['/'])
            return false;
        } 
        return true;
    }
 
}

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'users-list', children: [
    { path: '', component: UsersListComponent, canActivate : [AuthGuardService]},
    { path: 'user-detail', component: UserDetailComponent, canActivate : [AuthGuardService]}
  ]},
  { path: 'posts-list', children: [
    { path: '', component: PostsListComponent, canActivate : [AuthGuardService]},
    { path: 'post-detail', component: PostDetailComponent, canActivate : [AuthGuardService]}
  ]}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
