import { AuthService } from './../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../shared/model/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;

  constructor(private authservice: AuthService) {
  }

  ngOnInit(): void {
    this.authservice.user$.subscribe(usr => {
      debugger;
      this.user = usr;
    });
  }

  SaveChanges(name: string) {
    this.user.displayName = name;
    this.authservice.upateUser(this.user).then((x) => {

    });
  }
}
