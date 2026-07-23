import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Loaderservice } from '../../Services/loaderservice';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  showPassword = false;
  public loading: boolean = false;
  errorMessage: string = '';
  constructor(private router: Router, private authService: AuthService, public _loaderservice: Loaderservice, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login() {
    this._loaderservice.show();
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    this.authService.login(username, password).subscribe(
      result => {
        this._loaderservice.hide();
        //this.router.navigate(['/dashboard']);
      },
      error => {
        this._loaderservice.hide();
        this.errorMessage = 'Invalid login attempt';
      }
    );
  }

}

