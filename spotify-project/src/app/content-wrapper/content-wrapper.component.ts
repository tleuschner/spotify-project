import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { SpotifyService } from '../services/spotify.service';
import { Artist, Track, PlayHistoryObject } from '../models/SpotifyObjects';
import { PodiumObject } from '../models/PodiumObject';
import { DataService } from '../services/data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.css']
})

export class ContentWrapperComponent implements OnInit, OnDestroy {
  private isMobile = false;
  private titles = ['Top Tracks', 'Top Künstler', 'Top Genres', 'Zuletzt gehört'];
  private routing = ['tracks', 'artists', 'genres', 'recents'];
  private firstCall = true;
  private unsubscribe$ = new Subject<void>();

  // Track, Artist, Genre, Recents
  public podiumInfo: [PodiumObject[], PodiumObject[], PodiumObject[], PodiumObject[]] = [[], [], [], []];

  constructor(
    private spotifyService: SpotifyService,
    private breakpointObserver: BreakpointObserver,
    private dataService: DataService,
  ) { this.dataService.updateData('medium_term')}

  ngOnInit() {
    //sets mobile flag
    this.breakpointObserver.observe(['(min-width: 768px)']).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      if (result.matches) {
        this.isMobile = false;
      } else {
        this.isMobile = true;
      }
    });

    //Get Current User and puts their name into local storage for later use
    this.spotifyService.getUserInfo().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      localStorage.setItem("Person", res.display_name);
    });

    //update data each time change
    this.spotifyService.timeRange.pipe(takeUntil(this.unsubscribe$)).subscribe(time => {
        this.dataService.updateData(time);
    });

    //generates TopTracks podium
    this.dataService.topTracks.pipe(takeUntil(this.unsubscribe$)).subscribe((tracks: Track[]) => {
      let topTracks: PodiumObject[] = [];
      let topThree = tracks.slice(0, 3);

      topThree.forEach((track, index) => {
        let artists = [];
        track.artists.forEach(artist => { artists.push(artist.name) });

        let singleTrack: PodiumObject = {
          image: track.album.images[0].url,
          title: track.name,
          subtitle: artists.join(', '),
          ranking: `#${index + 1}`,
        }
        topTracks.push(singleTrack);
      });

      this.podiumInfo[0] = topTracks;
    });

    //Generate data for Top Genre Podium
    this.dataService.topGeneres.pipe(takeUntil(this.unsubscribe$)).subscribe((genres: [[string, number]]) => {
      let topGenres: PodiumObject[] = [];
      let allGenresCount = 0;
      for (let genre of genres) {
        allGenresCount += genre[1];
      }

      for (let i = 0; i < 3; i++) {
        let topGenre: PodiumObject = {
          image: undefined,
          title: genres[i][0],
          subtitle: `${Math.round(genres[i][1] / allGenresCount * 1000) / 10} %`
        }
        topGenres.push(topGenre);
      }

      this.podiumInfo[2] = topGenres;
    });

    //generate data for top Artist podium
    this.dataService.topArtists.pipe(takeUntil(this.unsubscribe$)).subscribe((artists: Artist[]) => {
      let topArtists: PodiumObject[] = [];
      artists = artists.slice(0, 3);

      artists.forEach((artist, index) => {
        let singleArtist: PodiumObject = {
          image: (artist.images[0] ? artist.images[0].url :  'http://timleuschner.de/img/nopic.png'),
          title: artist.name,
          ranking: `#${index + 1}`,
        }
        topArtists.push(singleArtist);
      });
      this.podiumInfo[1] = topArtists;
    });



    //Generate data for recently played podium
    this.dataService.recentlyPlayed.pipe(takeUntil(this.unsubscribe$)).subscribe((recentlyPlayed: PlayHistoryObject[]) => {
      recentlyPlayed = recentlyPlayed.slice(0, 3);
      let recentTracks: PodiumObject[] = [];

      recentlyPlayed.forEach((recentObject) => {
        let artists = [];
        recentObject.track.artists.forEach(artist => { artists.push(artist.name) });

        let singleTrack: PodiumObject = {
          image: recentObject.track.album.images[0].url,
          title: recentObject.track.name,
          subtitle: artists.join(', '),
          additionalInfo: new Date(recentObject.played_at).toLocaleString().replace('-', '.')
        }
        recentTracks.push(singleTrack);
      });
      this.podiumInfo[3] = recentTracks;
    });

  }

  //unsubscribe from service to avoid performance issues
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
