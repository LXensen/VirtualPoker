import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { AccountComponent } from './account/account.component';
import { NewgameComponent } from './newgame/newgame.component';
import { InvitesComponent } from './invites/invites.component';
import { GamesComponent } from './games/games.component';
import { MainComponent } from './main/main.component';
import { GameComponent } from './game/game.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MobileComponent } from './mobile/mobile.component';
import { GamesmallComponent } from './gamesmall/gamesmall.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signup/:gameid', component: SignupComponent},
  {path: 'games', component: GamesComponent, canActivate: [AuthGuard]},
  {path: 'game/:gameid', component: GameComponent, canActivate: [AuthGuard]},
  {path: 'gamesmall/:gameid', component: GamesmallComponent, canActivate: [AuthGuard]},
  {path: 'newgame', component: NewgameComponent, canActivate: [AuthGuard]},
  {path: 'invites/:id', component: InvitesComponent, canActivate: [AuthGuard]},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'manage', component: UsermanagementComponent},
  {path: 'mobile', component: MobileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
