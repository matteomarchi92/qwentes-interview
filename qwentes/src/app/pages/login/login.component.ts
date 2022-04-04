import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardTitleService } from 'src/app/services/card-title.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public login: any;

  constructor(
    public router: Router,
    public cardTitleService: CardTitleService,
  ) {
    this.cardTitleService.set('LOGIN')
    this.login = {
      email: '',
      password: ''
    }
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(this.login.email, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(this.login.password, [
        Validators.minLength(4),
        Validators.required
      ]),
    })
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onLogin() {
    let jwtObj = {
      email: this.loginForm.controls?.email?.valid ?? false,
      password: this.loginForm.controls?.password?.valid ?? false
    }
    let jwt = JSON.stringify(jwtObj)
    localStorage.setItem('token', jwt)
    this.router.navigate(['/users-list']);
  }
}
