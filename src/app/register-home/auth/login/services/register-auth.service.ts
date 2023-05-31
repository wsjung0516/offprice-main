import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
// import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
//import { UserService } from 'src/app/register-home/user-profile/user.service';
import jwt_decode from 'jwt-decode';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserTokenService } from 'src/app/core/services/user-token.service';
import { Observable, map, of, tap } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from 'src/app/core/components/user-profile/user-profile.component';
import { UserService } from 'src/app/user/user.service';
import { UserCouponsService } from 'src/app/core/services/user-coupons.service';
@Injectable({
  providedIn: 'root',
})
export class RegisterAuthService {
  token: any;
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private sharedMenuObservableService: SharedMenuObservableService,
    private userService: UserService,
    private sessionStorageService: SessionStorageService,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private userTokenService: UserTokenService,
    private userCouponsService: UserCouponsService
  ) {}
  isLoggedIn(): boolean {
    // console.log('this.token', this.token);
    const userId: any = this.sessionStorageService.getItem('userId');
    if (!userId) {
      return false;
    }
    // this.userTokenService.getUserToken().subscribe((profile: any) => {
    //   if( !profile ) {
    //     return false;
    //   }
    // });

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
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        this.createUserTokenFn(res).subscribe((ret: any) => {
          // this.sharedMenuObservableService.isLoggedIn.next(res.user.uid);
          this.userService.saveUserProfileToDB(res);

          if (res.user?.emailVerified == true) {
            this.checkIfSellerIsSet(ret, res);
          } else {
            this.router.navigate(['/login/verify-email']);
          }
        });
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/register-home/login']);
      }
    );
  }
  private createUserTokenFn(res: any): Observable<any> {
    return this.userTokenService.createUserToken(res).pipe(
      map((ret: any) => {
        // console.log('createUserTokenFn', ret);
        const value = JSON.parse(ret.token);
        const data = {
          id: ret.token_id,
          user_id: value.user.uid,
        };
        this.sessionStorageService.setItem('userId', data);
        return value;
      })
    );
  }
  // register method
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        alert('Registration Successful');
        this.sendEmailForVarification(res.user);
        this.router.navigate(['/register-hom/login']);
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/register-home/home/register']);
      }
    );
  }

  // sign out
  logout() {
    console.log('logout');

    this.sessionStorageService.removeItem('isRegisterLoggedIn');
    const userId: any = this.sessionStorageService.getItem('userId');
    if (!userId) return;

    this.fireauth.signOut().then(
      () => {
        this.userTokenService.getUserToken().subscribe((profile: any) => {
          // console.log('profile', profile);
          if (profile) {
            this.userTokenService.deleteUserToken();
            this.sessionStorageService.removeItem('userId');
            this.sessionStorageService.removeItem('isRegisterLoggedIn');
            this.sharedMenuObservableService.isLoggedOut.next(true);

            this.router.navigate(['/register-home/login']);
          }
        });
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
        this.createUserTokenFn(res).subscribe((ret: any) => {
          // console.log('createUserTokenFn -2', ret);
          this.checkIfSellerIsSet(ret, res);
        });
      },
      (err) => {
        alert(err.message);
      }
    );
  }
  private checkIfSellerIsSet(ret: any, res: any) {
    this.isSellerChecked(ret.user.uid).subscribe((isSeller: boolean) => {
      console.log('isSeller', isSeller);
      if (isSeller) {
        this.router.navigate(['/register-home']);
        this.sessionStorageService.setItem('isRegisterLoggedIn', true);
        this.userService.saveUserProfileToDB(res);

        // User Coupons
        this.checkIfUserCouponsAvailable();
      } else {
        // Input profile information
        this.inputProfileInfo(res).subscribe((ret: any) => {
          // console.log('inputProfileInfo', ret);
          if (ret?.body.seller === true) {
            this.router.navigate(['/register-home']);
            return;
          }
        });
      }
    });
  }

  public checkIfUserCouponsAvailable() {
    this.userCouponsService.getUserCoupons().subscribe((ret: any) => {
      // console.log('user coupon', ret.quantity);
      if (ret) {
        if (ret.quantity <= 5) {
          this.matSnackBar.open(
            'You have ' + ret.quantity + ' coupons left',
            'OK',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            }
          );
        }
        if (ret.quantity === 0) {
          this.matSnackBar.open(
            'You have ' + ret.quantity + ' coupons left',
            'OK',
            {}
          );
          this.logout();
        }
        this.sharedMenuObservableService.userCoupons.next(
          ret.quantity.toString()
        );
      } else {
        this.userCouponsService.createUserCoupon(200).subscribe((ret: any) => {
          console.log('createUserCoupon', ret);
        });
      }
    });
  }

  private isSellerChecked(uid: string): Observable<boolean> {
    return this.userService.getUser(uid).pipe(
      tap((user: any) => {
        // console.log('isSellerChecked', user);
      }),
      map((user: any) => {
        return user.seller;
      })
    );
  }
  private inputProfileInfo(res: any): Observable<any> {
    const dialogRef = this.dialog.open(UserProfileComponent, {});

    return dialogRef.afterClosed();
    // To show the register button
  }
  facebookSignIn() {
    return this.fireauth.signInWithPopup(new FacebookAuthProvider()).then(
      (res) => {
        console.log('facebook sign in', res.user?.displayName);
        console.log('facebook sign in', res.user?.email);
        console.log('facebook sign in', res);

        this.router.navigate(['/register']);
        this.userService.saveUserProfileToDB(res);
      },
      (err) => {
        alert(err.message);
      }
    );
  }
}
