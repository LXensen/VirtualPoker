import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './service/auth.service';
import { SETTINGS } from '@angular/fire/firestore';
import { TableComponent } from './table/table.component';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { ProfileComponent } from './profile/profile.component';
import { PlayerComponent } from './player/player.component';
import { NewgameComponent } from './newgame/newgame.component';
import { MainComponent } from './main/main.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { InvitesComponent } from './invites/invites.component';
import { AccountComponent } from './account/account.component';
import { FlopComponent } from './flop/flop.component';
import { GamesgridComponent } from './gamesgrid/gamesgrid.component';
import { FormsModule } from '@angular/forms';
import { TickerComponent } from './ticker/ticker.component';
import { TeamAbbr } from './shared/pipe/TeamAbbr';
import { LivefeedComponent } from './livefeed/livefeed.component';
import { LinescoreComponent } from './linescore/linescore.component';
import { BlindComponent } from './blind/blind.component';
import { PopupLayoutComponent } from './_layout/popup-layout/popup-layout.component';
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { AppHeaderComponent } from './_layout/app-header/app-header.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    TableComponent,
    UsermanagementComponent,
    ProfileComponent,
    PlayerComponent,
    NewgameComponent,
    MainComponent,
    GamesComponent,
    GameComponent,
    InvitesComponent,
    AccountComponent,
    FlopComponent,
    GamesgridComponent,
    TickerComponent,
    TeamAbbr,
    LivefeedComponent,
    LinescoreComponent,
    BlindComponent,
    PopupLayoutComponent,
    AppLayoutComponent,
    AppHeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireAuthModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    AuthService,   {
    provide: SETTINGS,
    useValue: environment.useEmulator ? {
      host: 'localhost:8080',
      ssl: false
    } : undefined
  },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
