import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import {HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { CardTitleComponent } from './components/card-title/card-title.component';
import { InitialsPipe } from './pipes/initials.pipe';
import { LoadingCardComponent } from './components/loading-card/loading-card.component';
import { ErrorCardComponent } from './components/error-card/error-card.component';
import { UserDetailComponent } from './pages/users-list/user-detail/user-detail.component';
import { PostDetailComponent } from './pages/posts-list/post-detail/post-detail.component';
import { PostsListComponent } from './pages/posts-list/posts-list.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersListComponent,
    MenuComponent,
    CardTitleComponent,
    InitialsPipe,
    LoadingCardComponent,
    ErrorCardComponent,
    UserDetailComponent,
    PostDetailComponent,
    PostsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
