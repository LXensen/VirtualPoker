import { AuthService } from './../service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authservice: AuthService) {
  }

  ngOnInit(): void {
  }

  SaveChanges() {
    alert('Nothing saved: does not do anything yet');
  }
}
