import { GameService } from './../service/game.service';
import { Router } from '@angular/router';
import { AuthService } from './../service/auth.service';
import { Gametemplate } from './../shared/model/gametemplate';
import { Component, OnInit, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-gamesgrid',
  templateUrl: './gamesgrid.component.html',
  styleUrls: ['./gamesgrid.component.css']
})
export class GamesgridComponent implements OnInit {

  games: Observable<Gametemplate[]>;
  userRefId: any;

  constructor(private authService: AuthService,
              private gameService: GameService,
              private router: Router) {
                this.authService.user$.subscribe(data => {
                  this.userRefId = data.uid;
                  if (data.pastGames && data.pastGames.length > 0) {
                    this.gameService.PlayersGames(data.pastGames).subscribe((usersGames) => {
                           this.games = usersGames;
                  });
                  }
                });
   }
  ngOnInit(): void {
  }

  GoToGame(gameId: string) {
  // set the players active game to this id
      this.gameService.SetPlayersCurrentGame(gameId, this.userRefId).then(() => {
        // update the stack of the player then route
        this.router.navigate(['game/' + gameId]);
      });
  }

  Invites(gameId: string) {
    this.router.navigate(['invites/' + gameId]);
  }
}
