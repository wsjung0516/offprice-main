import { Injectable, signal, effect } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { UserService } from 'src/app/user/user.service';
// import { UserService } from 'src/app/user-profile/user.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { UserTokenService } from 'src/app/core/services/user-token.service';
import { Observable, map, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import jwt_decode from 'jwt-decode';
import { UserCouponsService } from 'src/app/core/services/user-coupons.service';
import { UserId } from 'src/app/core/models/user.model';
import { CartItemsService } from './../../../components/cart-items/cart-items.service';
declare const FB: any;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private sharedMenuObservableService: SharedMenuObservableService,
    private userService: UserService,
    private sessionStorageService: SessionStorageService,
    private userTokenService: UserTokenService,
    private userCouponsService: UserCouponsService,
    // private cartItemsService: CartItemsService,
    private snackBar: MatSnackBar
  ) {
    effect(() => {
      // console.log('AuthService effect: ', this.user());
    });
  }
  user = signal<UserId | undefined>(undefined); // ret.user.accessToken, ret.user.uid, ret.user.email

  isLoggedIn(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const userId: any = this.sessionStorageService.getItem('userId');
      if (!userId) {
        resolve(false);
      } else {
        // this.userTokenService.getUserToken().subscribe(
        //   (loggedUser: any) => {
        //     console.log('isLoggedIn user', loggedUser);
        //     if (loggedUser) {
        //       const decoded: any = jwt_decode(loggedUser.credential?.idToken);
        //       const currentTime = new Date().getTime() / 1000;
        //       if (decoded.exp < currentTime) {
        //         const elapsedTime = currentTime - decoded.exp;
        //         const elapsedTimeInMinutes = elapsedTime / 60;
        //         this.snackBar.open(
        //           'Your session has expired. Please login again.',
        //           'Close',
        //           {
        //             // duration: 3000,
        //             verticalPosition: 'bottom',
        //             horizontalPosition: 'center',
        //           }
        //         );
        //         console.log('elapsedTime', elapsedTimeInMinutes);
        //         this.logoutProcess();
        //         resolve(false);
        //       } else {
        //         resolve(true);
        //       }
        //     } else {
        //       resolve(true);
        //     }
        //   },
        //   (error) => {
        //     reject(error);
        //   }
        // );
        resolve(true);
      }
    });
  }
  // login method
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        // console.log('createUserTokenFn -1', res);
        this.createUserTokenFn(res).subscribe((ret: any) => {
          // this.sharedMenuObservableService.displayName.next(res.user.displayName);
          // this.sharedMenuObservableService.isLoggedIn.next(res.user.uid);
          this.userService.saveUserProfileToDB(res);

          if (res.user?.emailVerified == true) {
            this.router.navigate(['/']);
            // User Coupons
            this.checkIfUserCouponsAvailable();
          } else {
            this.router.navigate(['/login/verify-email']);
          }
        });
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/login']);
      }
    );
  }

  private checkIfUserCouponsAvailable() {
    this.userCouponsService.getUserCoupons().subscribe((ret: any) => {
      // console.log('user coupon', ret.quantity);
      if (!ret) {
        this.userCouponsService.createUserCoupon(300).subscribe((ret: any) => {
          // console.log('createUserCoupon', ret);
        });
      } else {
        this.sharedMenuObservableService.userCoupons.set(
          ret.quantity.toString()
        );
      }
    });
  }

  private createUserTokenFn(res: any): Observable<any> {
    return this.userTokenService.createUserToken(res).pipe(
      map((ret: any) => {
        const value = JSON.parse(ret.token);
        console.log('createUserTokenFn', value);
        const data = {
          id: ret.token_id,
          user_id: value.user.uid,
        };
        this.sessionStorageService.setItem('userId', data);
        this.user.set(data);
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
        this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/login/register']);
      }
    );
  }

  // sign out
  logout() {
    const userId: any = this.sessionStorageService.getItem('userId');
    // Make logout action now when the the register logged out already
    // Clear display name. and clear cart badge count
    // And return because the register window cleared user token already
    if (!userId) {
      //
      // this.sharedMenuObservableService.cart_badge_count.set('0');
      // this.cartItemsService.cartItemsCount.set(0);
      this.user.set(undefined);
      //
      return;
    }
    this.logoutProcess();
  }

  private logoutProcess() {
    this.fireauth.signOut().then(
      () => {
        this.userTokenService.getUserToken().subscribe((profile: any) => {
          if (profile) {
            this.userTokenService.deleteUserToken();
            this.sessionStorageService.removeItem('userId');
            localStorage.removeItem('isStartMenuPassed');
            //
            // this.sharedMenuObservableService.cart_badge_count.set('0');
            //
            // this.sharedMenuObservableService.isLoggedOut.set(true);
          }
        });
        // this.router.navigate(['/login']);
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
          console.log('createUserTokenFn -1', ret);
          this.router.navigate(['/']);
          // this.sharedMenuObservableService.displayName.next(res.user?.displayName);
          // this.sharedMenuObservableService.isLoggedIn.next(res.user.uid);

          this.userService.saveUserProfileToDB(res);
          // User Coupons
          this.checkIfUserCouponsAvailable();
        });
      },
      (err) => {
        alert(err.message);
      }
    );
  }
}
// function jwt_decode(idToken: any): any {
//   throw new Error('Function not implemented.');
// }
