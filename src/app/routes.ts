import { Routes } from '@angular/router';
// import { LoginModule } from 'src/app/modules/dashboard/components/login/login.module';
// import { ForgotPasswordComponent } from 'src/app/modules/dashboard/components/login/forgot-password/forgot-password.component';
// import { UserRegisterComponent } from 'src/app/modules/dashboard/components/login/register/user-register.component';
// import { VerifyEmailComponent } from 'src/app/modules/dashboard/components/login/verify-email/verify-email.component';


export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/dashboard/components/login/login.module').then((m) => m.LoginModule),
  },
  // { path: 'login',children: [
  //   {path: '', redirectTo:'login', pathMatch:'full'},
  //   {path: 'login', component : LoginComponent},
  //   {path: 'user-register', component : UserRegisterComponent},
  //   {path: 'verify-email', component : VerifyEmailComponent},
  //   {path: 'forgot-password', component : ForgotPasswordComponent},
  //   ]
  // },
  { path: '**', redirectTo: 'error/404' },
];

