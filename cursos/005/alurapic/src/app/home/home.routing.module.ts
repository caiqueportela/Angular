import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from 'src/app/home/home.component';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { SigninComponent } from 'src/app/home/signin/signin.component';
import { SignupComponent } from 'src/app/home/signup/signup.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [
      AuthGuard
    ],
    children: [
      {
        path: '',
        component: SigninComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
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
