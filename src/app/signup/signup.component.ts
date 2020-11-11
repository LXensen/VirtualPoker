import { tap } from 'rxjs/operators';
import { GameService } from './../service/game.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  emailValid = true;
  passwordValid = true;
  password2Valid = true;
  displayNameValid = true;
  passwordsSame = true;

  gameRefId: string;

  constructor(private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private gameServie: GameService) {
    if (this.activatedRoute.snapshot.paramMap.get('gameid')) {
      this.gameRefId = this.activatedRoute.snapshot.paramMap.get('gameid');
     }
  }

  ngOnInit(): void {

  }

  SignUp(email: string, displayName: string, password: string, confirmPassword: string) {
    let isValid = true;

    if ( password !== confirmPassword ) {
       isValid = false;
       this.passwordsSame = false;
    }

    if (email === '') {
      isValid = false;
      this.emailValid = false;
    }

    if (displayName === '') {
      isValid = false;
      this.displayNameValid = false;
    }

    if (password === '') {
      isValid = false;
      this.passwordValid = false;
    }

    if (confirmPassword === '') {
      isValid = false;
      this.password2Valid = false;
    }

    if ( isValid ) {
    this.authService.SignUp(email, password, displayName).then(val => {
      if (val && (this.gameRefId !== undefined && this.gameRefId !== '')) {
            // tslint:disable-next-line:no-string-literal
            this.gameServie.AddNewlySignedUpPlayerToInvitedGame(this.gameRefId, val['uid'], val['displayName'], val['email']).then(x => {
              this.router.navigate(['account']);
            });
            // TODO - put a wait/tick before navigating. The method above may take a while
            // this.router.navigate(['account']);

      } else {
        // tslint:disable-next-line:no-string-literal
        this.gameServie.AddNewlySignedUpUser(val['uid'], val['displayName'], val['email']).then(() => {
          this.router.navigate(['account']);
        });
      }
    });
    }

  }
}
