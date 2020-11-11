import { AuthService } from './../service/auth.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  emailValid = true;
  passwordValid = true;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  SignIn(email: string, password: string) {
    console.log('you clicked signin');
    this.authService.SignIn(email, password).then((x) => {
      console.log('should redirect...');
      this.router.navigate(['account']);
    }).catch((error) => {
      window.alert(error.message);
    });
  }

  PromptForReset(email: string) {
    if (!email) {
      email = prompt('Please enter the email to send the reset link to');
    }
    this.authService.PassWordReset(email);
    return false;
  }
}
