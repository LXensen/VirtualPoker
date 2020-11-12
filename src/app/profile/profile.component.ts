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
      this.user = usr;
    });
  }

  SaveChanges(name: string) {
    this.authservice.upateUser(name).then(() => {
    });
  }
}
