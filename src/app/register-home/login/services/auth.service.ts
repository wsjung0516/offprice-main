import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SharedMenuObservableService } from 'src/app/register-home/core/services/shared-menu-observable.service';
import { UserService } from 'src/app/register-home/user-profile/user.service';
import jwt_decode from 'jwt-decode';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserTokenService } from 'src/app/core/services/user-token.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: any;
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private sharedMenuObservableService: SharedMenuObservableService,
    private userService: UserService,
    private sessionStorageService: SessionStorageService,
    private matSnackBar: MatSnackBar,
    private userTokenService: UserTokenService
  ) {
  }
  isLoggedIn(): boolean {
    // console.log('this.token', this.token);
    if (!this.token) {
      return false;
    }
    // this.userTokenService.getUserToken().subscribe((profile: any) => {
    //   if( !profile ) {
    //     return false;
    //   }
    // });

    const decoded: any = jwt_decode(this.token.credential.idToken);

    const currentTime = new Date().getTime() / 1000;
    if (decoded.exp < currentTime) {
      const elapsedTime = currentTime - decoded.exp;
      const elapsedTimeInMinutes = elapsedTime / 60;
      this.matSnackBar.open('Your session has expired. Please login again.', 'Close', {
        // duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
      console.log('elapsedTime', elapsedTimeInMinutes);
      this.sessionStorageService.removeItem('token');
      return false;
    }

    return true;
  }
  // login method
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        // console.log('res' , res)
        this.token = res;
        // this.sessionStorageService.setItem('token', res);
        this.sharedMenuObservableService.displayName.next(
          res.user?.displayName
        );
        this.userService.saveUserProfileToDB(res);

        if (res.user?.emailVerified == true) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login/verify-email']);
        }
        this.userTokenService.updateUserToken(res).subscribe((res: any) => {
        });

      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/login']);
      }
    );
  }

  // register method
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        alert('Registration Successful');
        this.sendEmailForVarification(res.user);
        this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/home/register']);
      }
    );
  }

  // sign out
  logout() {
    console.log('logout');
    this.fireauth.signOut().then(
      () => {
        this.userTokenService.deleteUserToken();
        this.sharedMenuObservableService.displayName.next('');
          this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  // forgot password
  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(
      () => {
        this.router.navigate(['/login/verify-email']);
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  // email varification
  sendEmailForVarification(user: any) {
    console.log(user);
    user.sendEmailVerification().then(
      (res: any) => {
        this.router.navigate(['/login/verify-email']);
      },
      (err: any) => {
        alert('Something went wrong. Not able to send mail to your email.');
      }
    );
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(
      (res) => {

        this.router.navigate(['/register-home']);
        this.sharedMenuObservableService.displayName.next(res.user?.displayName);
        this.userService.saveUserProfileToDB(res);
  
        this.userTokenService.updateUserToken(res).subscribe((res: any) => {
        });
        },
      (err) => {
        alert(err.message);
      }
    );
  }
  
  facebookSignIn() {
    return this.fireauth.signInWithPopup(new FacebookAuthProvider()).then(
      (res) => {
        console.log('facebook sign in', res.user?.displayName);
        console.log('facebook sign in', res.user?.email);
        console.log('facebook sign in', res);

        this.router.navigate(['/register']);
        this.sessionStorageService.setItem('token', res);
        this.userService.saveUserProfileToDB(res);
      },
      (err) => {
        alert(err.message);
      }
    );
  }
}
