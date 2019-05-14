import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { SpotifyService } from '../services/spotify.service';
import { VisitorsService } from '../services/visitors.service';
import { Artist, Track } from '../models/SpotifyObjects';
import { PodiumObject } from '../models/TopObject';

@Component({
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.css']
})
export class ContentWrapperComponent implements OnInit {
  private isMobile = false;

  // Track, Artist, Genre, Recents
  private podiumInfo: [PodiumObject[], PodiumObject[], PodiumObject[], PodiumObject[]] = [[], [], [], []];

  constructor(
    private spotifyService: SpotifyService,
    private breakpointObserver: BreakpointObserver,
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
      // clear old data

      //Get TopTracks and TopGeneres
      this.spotifyService.getTopSongs('50', undefined, time).subscribe((tracks: Track[]) => {
        let topTracks: PodiumObject[] = [];
        let topGenres: PodiumObject[] = [];

        //Populate with top 3 Tracks
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

        //Calculate top three Genres
        let artistIds = this.extractArtistIds(tracks);
        this.spotifyService.getArtists(artistIds).subscribe((artists: Artist[]) => {
          let genreCountMap = this.countGenres(artists);
          let sortedGenres = this.sortGenres(genreCountMap);
          //@ts-ignore
          let allGenresCount = <number>Object.values(genreCountMap).reduce((a, b) => (a + b));

          for (let i = 0; i < 3; i++) {
            let topGenre: PodiumObject = {
              image: undefined,
              title: sortedGenres[i][0],
              subtitle: `${sortedGenres[i][1] / allGenresCount}`
            }
            topGenres.push(topGenre);
          }
          this.podiumInfo[2] = topGenres;
        });
      });


      //Get TopArtists
      this.spotifyService.getTopArtists('3', undefined, time).subscribe((artists: Artist[]) => {
        let topArtists: PodiumObject[] = [];

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

      //Get Genres

      //Get recents
      this.spotifyService.getRecentlyPlayed(3).subscribe(recentlyPlayed => {
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
    });



    // this.spotifyService.timeRange.subscribe(time => {
    //   this.artists = [];
    //   this.spotifyService.getTopSongs('3', undefined, time).subscribe(res => {
    //     this.topSongs = res;
    //     for(let topSong of res){
    //       let newArtists = [];
    //       //@ts-ignore
    //       for(let artist of topSong.artists){
    //         newArtists.push(artist.name);
    //       }
    //       this.artists.push(newArtists.join(','));
    //     }
    //   });
    // });

  }


  private extractArtistIds(tracks: Track[]): string[] {
    let artistIds: string[] = [];
    for (let track of tracks) {
      for (let artist of track.artists) {
        artistIds.push(artist.id);
      }
    }
    return artistIds;
    // return Array.from(new Set(artistIds));
  }

  private countGenres(artists: Artist[]) {
    let genreMap = {};

    for (let artist of artists) {
      for (let genre of artist.genres) {
        if (!genreMap[genre]) {
          genreMap[genre] = 1;
        } else {
          genreMap[genre]++;
        }
      }
    }
    return genreMap;
  }

  private sortGenres(genreMap) {
    let sortable = [];
    for (let genre in genreMap) {
      sortable.push([genre, genreMap[genre]]);
    }
    sortable.sort((a, b) => {
      return b[1] - a[1];
    });
    return sortable;
  }

}
