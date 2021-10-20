import { AuthService } from './../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../shared/model/user';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;

  constructor(private authservice: AuthService,
              private svcLocalStorage: LocalStorageService) {
  }

  ngOnInit(): void {
      this.user = this.svcLocalStorage.get<User>('user');
  }

  SaveChanges(name: string) {
    this.user.displayName = name;
    this.authservice.upateUser(this.user).then((x) => {

    });
  }
}
