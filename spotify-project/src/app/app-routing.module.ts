import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { LoginComponent } from './login/login.component';
import { ContentWrapperComponent } from './content-wrapper/content-wrapper.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GenreDetailsComponent } from "./genre-details/genre-details.component";
import { DetailViewComponent } from './detail-view/detail-view.component';

//declares the routes, certain routes can only be accessed when logged, also adds animation to the routing events
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ContentWrapperComponent, canActivate: [AuthGuard], data: { animation: 'Dashboard' } },
  { path: 'details/:id', component: DetailViewComponent, canActivate: [AuthGuard], data: { animation: 'Analysis' } },
  { path: 'genre-details', component: GenreDetailsComponent, canActivate: [AuthGuard], data: { animation: 'Analysis' } },
  { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true}),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
