import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, catchError, delay, map, of, switchMap, tap } from 'rxjs';
// import { RegisterAuthService } from 'src/app/register-home/auth/login/services/register-auth.service';
import { UserService } from 'src/app/user/user.service';
import { UserCouponsService } from './user-coupons.service';
import { UserProfileComponent } from '../components/user-profile/user-profile.component';
import { SharedMenuObservableService } from './shared-menu-observable.service';
import { AuthService } from 'src/app/core/auth/login/services/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { de } from 'date-fns/locale';
@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class CheckIfSellerSetService {
  constructor(
    private router: Router,
    private userService: UserService,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private userCouponsService: UserCouponsService,
    private sharedMenuObservableService: SharedMenuObservableService,
    private authService: AuthService
  ) {}
  isSeller(ret: any, res: any) {
    this.isSellerChecked(ret.user.uid)
      .pipe(untilDestroyed(this))
      .subscribe((isSeller: boolean) => {
        // console.log('isSeller', isSeller);
        if (isSeller) {
          this.router.navigate(['/register-home']);
          this.userService.saveUserProfileToDB(res);

          // User Coupons
          this.checkIfUserCouponsAvailable()
            .pipe(untilDestroyed(this))
            .subscribe((ret: any) => {});
        } else {
          // Input profile information
          this.inputProfileInfo(res)
            .pipe(untilDestroyed(this))
            .subscribe((ret: any) => {
              // console.log('inputProfileInfo', ret);
              if (ret?.body.seller === true) {
                this.router.navigate(['/register-home']);
                return;
              } else {
                this.authService.logout();
              }
            });
        }
      });
  }
  isChecked(uid: string, res?: any): Observable<boolean> {
    return this.isSellerChecked(uid).pipe(
      switchMap((isSeller: boolean) => {
        if (isSeller) {
          return this.checkIfUserCouponsAvailable().pipe(
            tap((ret: any) => {
              // console.log('isUserCouponAvailable', ret);
            })
          );
        } else {
          return this.inputProfileInfo(res).pipe(
            map((ret: any) => {
              // console.log('inputProfileInfo', ret.body.seller);
              return ret?.body.seller === true;
            })
          );
        }
      }),
      catchError(() => of(false))
    );
  }

  private isSellerChecked(uid: string): Observable<boolean> {
    return this.userService.getUser(uid).pipe(
      tap((user: any) => {
        // console.log('isSellerChecked', user);
      }),
      map((user: any) => user.seller),
      catchError(() => of(false))
    );
  }

  private inputProfileInfo(res?: any): Observable<any> {
    const dialogRef = this.dialog.open(UserProfileComponent, {});

    return dialogRef.afterClosed();
  }

  public checkIfUserCouponsAvailable(): Observable<boolean> {
    return this.userCouponsService.getUserCoupons().pipe(
      tap((ret: any) => {
        // console.log('user coupon', ret.quantity);
        this.sharedMenuObservableService.userCoupons.set(
          ret.quantity.toString()
        );

        if (ret.quantity >= 0) {
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
            // return true; <- Remove this line
          }
          if (ret.quantity === 0) {
            this.matSnackBar.open(
              'You have ' + ret.quantity + ' coupons left',
              'OK',
              {}
            );
            // return false; <- Remove this line
          }
        } else {
          // This function is used only limited period.
          this.userCouponsService
            .createUserCoupon(300)
            .subscribe((ret: any) => {
              console.log('createUserCoupon', ret);
            });
        }
      }),
      map((ret: any) => ret.quantity >= 0),
      catchError(() => of(false))
    );
  }

  // isChecked(uid: string, res?: any): boolean{
  //   // return new Promise((resolve, reject) => {

  //     this.isSellerChecked(uid).subscribe((isSeller: boolean) => {
  //       if (isSeller) {
  //         return this.checkIfUserCouponsAvailable().then((ret:any) => {
  //           console.log('isSeller', ret);
  //           // resolve(ret);
  //           return ret;
  //           // if( ret ) {
  //           //   this.router.navigate(['/register-home']);
  //           //   return;
  //           // } else {
  //           //   this.authService.logout();
  //           // }

  //         });
  //       } else {
  //         // Input profile information
  //         return this.inputProfileInfo(res).subscribe((ret: any) => {
  //           if (ret?.body.seller === true) {
  //             console.log('inputProfileInfo', ret.body.seller);
  //             // this.router.navigate(['/register-home']);
  //             return true;
  //           } else {
  //             return false;
  //           }
  //         });
  //       }
  //     });
  //     return false;
  //   // });
  // }
  // private isSellerChecked(uid: string): Observable<boolean> {
  //   return this.userService.getUser(uid).pipe(
  //     tap((user: any) => {
  //       console.log('isSellerChecked', user);
  //     }),
  //     map((user: any) => {
  //       return user.seller;
  //     })
  //   );
  // }
  // private inputProfileInfo(res?: any): Observable<any> {
  //   const dialogRef = this.dialog.open(UserProfileComponent, {});

  //   return dialogRef.afterClosed();
  //   // To show the register button
  // }
  // public checkIfUserCouponsAvailable(): Promise<boolean> {
  //   return new Promise((resolve, reject) => {

  //     this.userCouponsService.getUserCoupons().subscribe((ret: any) => {
  //       console.log('user coupon', ret.quantity);
  //       this.sharedMenuObservableService.userCoupons.set(
  //         ret.quantity.toString()
  //       );

  //       if (ret.quantity >= 0) {
  //         if (ret.quantity <= 5) {
  //           this.matSnackBar.open(
  //             'You have ' + ret.quantity + ' coupons left',
  //             'OK',
  //             {
  //               duration: 5000,
  //               horizontalPosition: 'center',
  //               verticalPosition: 'bottom',
  //             }
  //           );
  //           resolve(true);
  //         }
  //         if (ret.quantity === 0) {
  //           this.matSnackBar.open(
  //             'You have ' + ret.quantity + ' coupons left',
  //             'OK',
  //             {}
  //           );
  //           resolve(false);
  //         }
  //       } else {
  //         // This function is used only limited period.
  //         this.userCouponsService.createUserCoupon(300).subscribe((ret: any) => {
  //           console.log('createUserCoupon', ret);
  //         });
  //       }
  //     });
  //   });
  // }
}
