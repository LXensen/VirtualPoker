import { AuthService } from './../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: Observable<boolean>;
  constructor(public authService: AuthService) {
    // this.authService.IsLoggedIn().subscribe(logedin => {
    //   debugger;
    //   if(logedin){
    //     this.isLoggedIn = true;
    //     debugger;
    //   }
      
    // })
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.IsLoggedIn();
  }

}
