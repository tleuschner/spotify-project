import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { SpotifyService } from '../services/spotify.service';
import { VisitorsService } from '../services/visitors.service';
import { Artist, Track, PlayHistoryObject } from '../models/SpotifyObjects';
import { PodiumObject } from '../models/PodiumObject';
import { DataService } from '../data.service';

@Component({
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.css']
})
export class ContentWrapperComponent implements OnInit {
  private isMobile = false;
  private titles = ['Top Tracks', 'Top Künstler', 'Top Genres', 'Zuletzt gehört'];
  private routing = ['tracks', 'artists', 'genres', 'recents'];

  // Track, Artist, Genre, Recents
  public podiumInfo: [PodiumObject[], PodiumObject[], PodiumObject[], PodiumObject[]] = [[], [], [], []];

  constructor(
    private spotifyService: SpotifyService,
    private breakpointObserver: BreakpointObserver,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    // Wahrscheinlich auch über CSS lösbar aber klappt ;)
    this.breakpointObserver.observe(['(min-width: 768px)']).subscribe(result => {
      // this.isMobile = !result.matches
      if (result.matches) {
        this.isMobile = false;
      } else {
        this.isMobile = true;
      }
    });
    this.spotifyService.getUserInfo().subscribe(res => {
      localStorage.setItem("Person", res.display_name);
    });


    this.spotifyService.timeRange.subscribe(time => {
      console.log(time);
      //update data each time change
      this.dataService.updateData(time);

    });

    this.dataService.topTracks.subscribe((tracks: Track[]) => {
      let topTracks: PodiumObject[] = [];
      let topThree = tracks.splice(0, 3);

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

    //Get TopGenres
    this.dataService.topGeneres.subscribe((genres: [[string, number]]) => {
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

    this.dataService.topArtists.subscribe((artists: Artist[]) => {
      let topArtists: PodiumObject[] = [];
      artists = artists.slice(0, 3);

      artists.forEach((artist, index) => {
        let singleArtist: PodiumObject = {
          image: artist.images[0].url,
          title: artist.name,
          ranking: `#${index + 1}`,
        }
        topArtists.push(singleArtist);
      });
      this.podiumInfo[1] = topArtists;
    });



    //Get recents
    this.dataService.recentlyPlayed.subscribe((recentlyPlayed: PlayHistoryObject[]) => {
      recentlyPlayed = recentlyPlayed.splice(0, 3);
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


}
