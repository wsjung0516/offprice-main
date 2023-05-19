import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, FacebookAuthProvider} from '@angular/fire/auth'
import { Router } from '@angular/router';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { UserService } from 'src/app/user/user.service';
// import { UserService } from 'src/app/user-profile/user.service';
import { SessionStorageService } from './../../../../../core/services/session-storage.service';
import { UserTokenService } from 'src/app/core/services/user-token.service';
import { Observable, map, tap } from 'rxjs';
declare const FB: any;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth : AngularFireAuth,
     private router : Router,
     private sharedMenuObservableService: SharedMenuObservableService,
     private userService: UserService,
     private sessionStorageService: SessionStorageService,
     private userTokenService: UserTokenService,
     ) { }
     isLoggedIn(): boolean {
      const userId:any = this.sessionStorageService.getItem('userId');
      if (!userId) {
        return false;
      }
      
      // const decoded: any = jwt_decode(this.token.credential.idToken);
  
      // const currentTime = new Date().getTime() / 1000;
      // if (decoded.exp < currentTime) {
      //   const elapsedTime = currentTime - decoded.exp;
      //   const elapsedTimeInMinutes = elapsedTime / 60;
      //   this.matSnackBar.open('Your session has expired. Please login again.', 'Close', {
      //     // duration: 3000,
      //     verticalPosition: 'bottom',
      //     horizontalPosition: 'center',
      //   });
      //   console.log('elapsedTime', elapsedTimeInMinutes);
      //   this.sessionStorageService.removeItem('token');
      //   return false;
      // }
  
      return true;
    }
  // login method
  login(email : string, password : string) {
    this.fireauth.signInWithEmailAndPassword(email,password).then( res => {
      // console.log('res' , res)
        // this.sessionStorageService.setItem('token',res);
        this.createUserTokenFn(res).subscribe(
          (ret: any) => {
            // this.sharedMenuObservableService.displayName.next(res.user.displayName);
            this.sharedMenuObservableService.isLoggedIn.next(res.user.uid);
            this.userService.saveUserProfileToDB(res);
    
            if(res.user?.emailVerified == true) {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/login/verify-email']);
            }

          });

    }, err => {
        alert(err.message);
        this.router.navigate(['/login']);
    })
  }

  private createUserTokenFn(res:any): Observable<any> {
    return this.userTokenService.createUserToken(res).pipe(
      map((ret: any) => {
      console.log('createUserTokenFn', ret);
      const value = JSON.parse(ret.token);
      const data = {
        id: ret.token_id,
        user_id: value.user.uid,
      };
      this.sessionStorageService.setItem('userId', data);
      return value;
    }));
  }

  // register method
  register(email : string, password : string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then( res => {
      alert('Registration Successful');
      this.sendEmailForVarification(res.user);
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
      this.router.navigate(['/login/register']);
    })
  }

  // sign out
  logout() {
    this.fireauth.signOut().then( () => {
      const userId:any = this.sessionStorageService.getItem('userId');
      this.userTokenService.deleteUserToken();
      this.sessionStorageService.removeItem('userId');
      this.sharedMenuObservableService.displayName.next('Guest');
      this.sharedMenuObservableService.closeRegisterButton.next(false);
      this.sharedMenuObservableService.cart_badge_count.next('0');
      // this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    })
  }

  // forgot password
  forgotPassword(email : string) {
      this.fireauth.sendPasswordResetEmail(email).then(() => {
        this.router.navigate(['/login/verify-email']);
      }, err => {
        alert('Something went wrong');
      })
  }

  // email varification
  sendEmailForVarification(user : any) {
    console.log(user);
    user.sendEmailVerification().then((res : any) => {
      this.router.navigate(['/login/verify-email']);
    }, (err : any) => {
      alert('Something went wrong. Not able to send mail to your email.')
    })
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {
      
      // this.sessionStorageService.setItem('token',res);
      this.createUserTokenFn(res).subscribe(
        (ret: any) => {
          console.log('createUserTokenFn', ret);
          this.router.navigate(['/']);
          // this.sharedMenuObservableService.displayName.next(res.user?.displayName);
          this.sharedMenuObservableService.isLoggedIn.next(res.user.uid);
    
          this.userService.saveUserProfileToDB(res);
        }
      );

    }, err => {
      alert(err.message);
    })
  }
  facebookSignIn() {
    FB.login((response: any) => {},{scope: 'small'});
  }

}
