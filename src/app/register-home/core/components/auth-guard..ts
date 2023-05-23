import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/register-home/login/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorageService } from 'src/app/register-home/core/services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private matSnackBar: MatSnackBar) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // console.log('route, state', route, state);
      if (this.auth.isLoggedIn()) {
        // this.sessionStorageService.setItem('isRegisterLoggedIn', true);
        return true;
      } else {
        // this.matSnackBar.open('You don\'t have permission to view this page', 'Close', {
        //   duration: 3000,
        //   verticalPosition: 'bottom',
        //   horizontalPosition: 'center',
        // });
        this.router.navigate(['/register-home/login'],{ queryParams: { returnUrl: state.url }});
        return false;
      }
  }

}
