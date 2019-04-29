import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { ContentWrapperComponent } from './content-wrapper/content-wrapper.component';
import { TrackAnalysisComponent } from './track-analysis/track-analysis.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ContentWrapperComponent, canActivate: [AuthGuard], data: {animation: 'Dashboard'} },
  { path: 'track-analysis/:type', component: TrackAnalysisComponent, canActivate: [AuthGuard], data: {animation: 'Analysis'} },
  { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
