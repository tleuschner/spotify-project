import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { LoginComponent } from './login/login.component';
import { ContentWrapperComponent } from './content-wrapper/content-wrapper.component';
import { TrackAnalysisComponent } from './track-analysis/track-analysis.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {ArtistDetailsComponent} from "./artist-details/artist-details.component";
import {RecentlyDetailsComponent} from "./recently-details/recently-details.component";
import {GenreDetailsComponent} from "./genre-details/genre-details.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ContentWrapperComponent, canActivate: [AuthGuard], data: {animation: 'Dashboard'} },
  { path: 'track-analysis/:type', component: TrackAnalysisComponent, canActivate: [AuthGuard], data: {animation: 'Analysis'} },
  { path: 'artist-details', component: ArtistDetailsComponent, canActivate: [AuthGuard], data: {animation: 'Analysis'}},
  { path: 'recently-details', component: RecentlyDetailsComponent, canActivate: [AuthGuard], data: {animation: 'Analysis'}},
  { path: 'genre-details', component: GenreDetailsComponent, canActivate: [AuthGuard], data: {animation: 'Analysis'}},
  { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
