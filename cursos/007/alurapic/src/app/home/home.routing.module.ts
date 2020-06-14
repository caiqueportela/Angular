import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from 'src/app/home/home.component';
import { LoginGuard } from 'src/app/core/auth/login.guard';
import { SigninComponent } from 'src/app/home/signin/signin.component';
import { SignupComponent } from 'src/app/home/signup/signup.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [
      LoginGuard
    ],
    children: [
      {
        path: '',
        component: SigninComponent,
        data: {
          title: 'Sign in'
        }
      },
      {
        path: 'signup',
        component: SignupComponent,
        data: {
          title: 'Sign up'
        }
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }
