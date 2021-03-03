import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { PRIMARY_OUTLET, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  blindVisible = false;
  constructor(public authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    // see if this url contains /game/
    if (this.router.parseUrl(this.router.url).root.hasChildren()){
      this.blindVisible = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments[0].path === 'game';
    }
  }

}
