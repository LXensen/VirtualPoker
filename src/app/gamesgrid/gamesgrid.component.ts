import { GameService } from './../service/game.service';
import { Router } from '@angular/router';
import { AuthService } from './../service/auth.service';
import { Gametemplate } from './../shared/model/gametemplate';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../shared/model/user';

@Component({
  selector: 'app-gamesgrid',
  templateUrl: './gamesgrid.component.html',
  styleUrls: ['./gamesgrid.component.css']
})
export class GamesgridComponent implements OnInit {

  games: Observable<Gametemplate[]>;
  // userRefId: any;
  user: User;

  constructor(private authService: AuthService,
              private gameService: GameService,
              private router: Router) {
                this.authService.user$.subscribe(usr => {
                  this.user = usr;
                  if (usr.pastGames && usr.pastGames.length > 0) {
                    this.gameService.PlayersGames(usr.pastGames).subscribe((usersGames) => {
                           this.games = usersGames;
                  });
                  }
                });
   }
  ngOnInit(): void {
  }

  GoToGame(gameId: string) {
  // set the players active game to this id
      this.gameService.SetPlayersCurrentGame(gameId, this.user).then(() => {
        // update the stack of the player then route
        this.router.navigate(['game/' + gameId]);
      });
  }

  Invites(gameId: string) {
    this.router.navigate(['invites/' + gameId]);
  }
}
