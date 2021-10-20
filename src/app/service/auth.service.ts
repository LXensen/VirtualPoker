import { of, Observable } from 'rxjs';
import { Injectable, isDevMode } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, first, take, map, tap } from 'rxjs/operators';
import { User } from '../shared/model/user';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // user$: Observable<User>;

  // loggedin = false;
  // FireUser: User = JSON.parse(localStorage.getItem('user')) !== null  ? JSON.parse(localStorage.getItem('user')) : null ;

constructor(private afs: AngularFirestore,
            private afAuth: AngularFireAuth,
            private svcLocalStorage: LocalStorageService) {
                // Get the AuthUser, then transform it (switchMap) to get the app user doc (users/user.id)
                this.afAuth.authState.pipe(
                  switchMap(user => {
                    debugger;
                    if (user) {
                      // this.loggedin = true;
                      if(this.svcLocalStorage.get<User>('user') === null){
                        const userData: User = {
                          uid: user.uid,
                          email: user.email,
                          displayName: user.displayName
                        };
                        this.afs.collection<User>(`users/${user.uid}`).get().subscribe(usrDoc => {
                          debugger;
                          if(user.displayName === ''){
                            userData.displayName = usrDoc.docs[0].data().displayName;
                          }
                          this.svcLocalStorage.set('user', userData);
                        })
                      }
                      // const userData: User = {
                      //   uid: user.uid,
                      //   email: user.email,
                      //   displayName: user.displayName
                      // };
                      // if(this.svcLocalStorage.get<User>('user') === null){
                      //   this.svcLocalStorage.set('user', userData);
                      // }
                      
                      // return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                    } else {
                      this.svcLocalStorage.set('user', null);
                      return of(null);
                    }
                  })
                );
  }
  // Sign in with email/password
  async SignIn(email: string, password: string) {
    if (isDevMode()){
      return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(user => {
        // set the user/user_id table.
        // We have to do this because when we restart the emulator,
        // the users/user_ref_id table is reset
        // NOTE: in 'prod', this is done on Sign Up
        return this.SetUserData(user.user);
      });
    } else {
      return this.afAuth.signInWithEmailAndPassword(email, password);
    }
  }

  async upateUser(user: User){
      const userData: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };

      this.SetUserData(userData);

      return (await this.afAuth.currentUser).updateProfile({
        displayName: user.displayName
      });
  }

  async ConfirmPasswordReset(code: string, password: string): Promise<any>{
    return this.afAuth.confirmPasswordReset(code, password);
  }

  // tslint:disable-next-line: typedef
  async PassWordReset(email: string){
    return this.afAuth.sendPasswordResetEmail(email);
  }

  // Sign up with email/password
  async SignUp(email: string, password: string, displayName: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        return result.user.updateProfile({displayName}).then(() => {
          // Initialize the app user (users/user_id) here, not in Sign In
          const userData: User = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            currentGame: '',
          };
          this.SetUserData(userData);
          return result.user;
        });
      }).catch((error) => {
        window.alert(error.message);
        return false;
      });
  }

  async VerifyPasswordReset(code: string): Promise<string>{
    return this.afAuth.verifyPasswordResetCode(code);
  }

  IsLoggedIn(): Observable<boolean> {
    // this.afAuth.authState.subscribe(x => {
    //   debugger;
    // })
    // return this.afAuth.authState.pipe(first()).toPromise();
      return this.afAuth.authState.pipe(
        map(user => !!user),
        tap(loggedin => {
          return (loggedin ? true : false);
        }));
  }

  SetUserData(user) {
    const batchUpdate = this.afs.firestore.batch();

    const usersGames = this.afs.firestore.collection('usersGames').doc(user.uid);
    batchUpdate.set(usersGames, {},{merge: true});

    const userRef = this.afs.firestore.collection('users').doc(user.uid);

    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    };
    this.svcLocalStorage.set('user', userData);
    batchUpdate.set(userRef, userData);

    return batchUpdate.commit();
  }
}
