import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, FacebookAuthProvider} from '@angular/fire/auth'
import { Router } from '@angular/router';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { UserService } from 'src/app/user/user.service';
// import { UserService } from 'src/app/user-profile/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth : AngularFireAuth,
     private router : Router,
     private sharedMenuObservableService: SharedMenuObservableService,
     private userService: UserService
     ) { }

  // login method
  login(email : string, password : string) {
    this.fireauth.signInWithEmailAndPassword(email,password).then( res => {
      // console.log('res' , res)
        localStorage.setItem('token',JSON.stringify(res));
        this.sharedMenuObservableService.displayName.next(res.user?.displayName);
        this.userService.saveUserProfileToDB(res);

        if(res.user?.emailVerified == true) {
          this.router.navigate(['/register']);
        } else {
          this.router.navigate(['/login/varify-email']);
        }

    }, err => {
        alert(err.message);
        this.router.navigate(['/login']);
    })
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
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    })
  }

  // forgot password
  forgotPassword(email : string) {
      this.fireauth.sendPasswordResetEmail(email).then(() => {
        this.router.navigate(['/login/varify-email']);
      }, err => {
        alert('Something went wrong');
      })
  }

  // email varification
  sendEmailForVarification(user : any) {
    console.log(user);
    user.sendEmailVerification().then((res : any) => {
      this.router.navigate(['/login/varify-email']);
    }, (err : any) => {
      alert('Something went wrong. Not able to send mail to your email.')
    })
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {
      console.log('google sign in',res.user?.displayName);
      console.log('google sign in',res.user?.email);
      console.log('google sign in',res);
      
      this.router.navigate(['/register']);
      localStorage.setItem('token',JSON.stringify(res));
      this.userService.saveUserProfileToDB(res);

    }, err => {
      alert(err.message);
    })
  }
  facebookSignIn() {
    return this.fireauth.signInWithPopup(new FacebookAuthProvider).then(res => {
      console.log('facebook sign in',res.user?.displayName);
      console.log('facebook sign in',res.user?.email);
      console.log('facebook sign in',res);

      this.router.navigate(['/register']);
      localStorage.setItem('token',JSON.stringify(res));
      this.userService.saveUserProfileToDB(res);

    }, err => {
      alert(err.message);
    })
  }

}
