import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
 loginData: any = {}
  public loading: boolean = false;
model = {
    username: '',
    password: ''
  };
  errorMessage: string = '';
   constructor(private router: Router, private authService: AuthService){}
  ngOnInit() {
    debugger;
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.authService.login(this.model.username, this.model.password).subscribe(
      result => {
        this.loading = false;
        //this.router.navigate(['/dashboard']);
      },
      error => {
        this.loading = false;
        this.errorMessage = this.authService.errorMessage.error;
      }
    );
  }
  }

