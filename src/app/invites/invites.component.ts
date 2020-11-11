import { ActivatedRoute } from '@angular/router';
import { GameService } from './../service/game.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css']
})
export class InvitesComponent implements OnInit {
  private gameRefId: string;
  public invites = new Array<any>();

  constructor(private gameService: GameService, private activatedRoute: ActivatedRoute) {
    this.gameRefId = this.activatedRoute.snapshot.paramMap.get('id');

    this.gameService.GameInvitees(this.gameRefId).subscribe(obj => {
      this.invites = obj.data().invites;
    });
  }

  ngOnInit(): void {
  }

  Add(email: string) {

  }

  Resend(email: string) {

  }
}
