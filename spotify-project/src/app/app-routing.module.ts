import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { ContentWrapperComponent } from './content-wrapper/content-wrapper.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent,  },
  { path: '**', component: ContentWrapperComponent, canActivate: [AuthGuard] },
  { path: '', component: ContentWrapperComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
