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
import { LivefeedComponent } from './livefeed/livefeed.component';
import { LinescoreComponent } from './linescore/linescore.component';
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { PopupLayoutComponent } from './_layout/popup-layout/popup-layout.component';

// const routes: Routes = [
//   {path: '', component: MainComponent},
//   {path: 'signin', component: SigninComponent},
//   {path: 'signup', component: SignupComponent},
//   {path: 'signup/:gameid', component: SignupComponent},
//   {path: 'games', component: GamesComponent, canActivate: [AuthGuard]},
//   {path: 'game/:gameid', component: GameComponent, canActivate: [AuthGuard]},
//   {path: 'newgame', component: NewgameComponent, canActivate: [AuthGuard]},
//   {path: 'invites/:id', component: InvitesComponent, canActivate: [AuthGuard]},
//   {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
//   {path: 'manage', component: UsermanagementComponent},
//   {path: 'livefeed/:gameid', component: LivefeedComponent},
//   {path: 'linescore/:gameid', component: LinescoreComponent}
// ];
const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {path: 'game/:gameid', component: GameComponent, canActivate: [AuthGuard]},
    ]
  },
  {
    path: '',
    component: AppLayoutComponent,
          children: [
            {path: '', component: MainComponent},
            {path: 'signin', component: SigninComponent},
            {path: 'signup', component: SignupComponent},
            {path: 'signup/:gameid', component: SignupComponent},
            {path: 'games', component: GamesComponent, canActivate: [AuthGuard]},
            {path: 'newgame', component: NewgameComponent, canActivate: [AuthGuard]},
            {path: 'invites/:id', component: InvitesComponent, canActivate: [AuthGuard]},
            {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
            {path: 'manage', component: UsermanagementComponent},
            {path: 'livefeed/:gameid', component: LivefeedComponent}
          ]
  },
  {
    path: '',
    component: PopupLayoutComponent,
    children: [
      {path: 'linescore/:gameid', component: LinescoreComponent}
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
