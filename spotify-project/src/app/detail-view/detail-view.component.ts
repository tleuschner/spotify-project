import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { Track, Artist, PlayHistoryObject } from '../models/SpotifyObjects';
import { PodiumObject } from '../models/PodiumObject';
import { DetailObject } from '../models/DetailObject';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css']
})
export class DetailViewComponent implements OnInit {
  private type: string;
  public false = false;
  public title: string = 'asdf';
  public podium = false;
  private topTracks: Track[];
  private topArtists: Artist[];
  public podiumObject: PodiumObject[] = [];
  public detailObject: DetailObject[] = [];


  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.type = params.get('id');
      if (this.type === 'tracks' || this.type === 'artists' || this.type === 'recents') {
        this.podium = true;
      } else {
        this.podium = false;
      }

      switch (this.type) {
        case 'tracks':
          this.generateTopTrackData();
          this.title = "Top Tracks";
          break;
        case 'artists':
          this.generateTopArtistsData();
          this.title = "Top Künstler";
          break;
        case 'recents':
          this.generateRecentlyListenedData();
          this.title = "Zuletzt gehört";
          break;
        case 'genres':
          console.log('nice');
          break;
        case 'playlist':
          console.log('nice');
        default:
        this.router.navigate(['/404'])
          break;
      }
    });

    this.spotifyService.timeRange.subscribe(time => {
      console.log('called')
      this.dataService.updateData(time);
    });



  }

  private generateTopTrackData() {
    
    this.dataService.topTracks.subscribe((tracks: Track[]) => {
      let startTime = performance.now();
      this.podiumObject = [];
      this.detailObject = [];
      let podiumArtists = tracks.slice(0, 3);
      let detailArtists = tracks.slice(3, tracks.length);

      podiumArtists.forEach((track, index) => {
        let artists = [];
        track.artists.forEach(artist => { artists.push(artist.name) });

        let singleTrack: PodiumObject = {
          image: track.album.images[0].url,
          title: track.name,
          subtitle: artists.join(', '),
          ranking: `#${index + 1}`,
        }
        this.podiumObject.push(singleTrack);
      });

      detailArtists.forEach((track, index) => {
        let artists = [];
        track.artists.forEach(artist => { artists.push(artist.name) });

        let detailTrack: DetailObject = {
          image: track.album.images[1].url,
          firstLine: track.name,
          secondLine: artists.join(', '),
          thirdLine: `#${index + 4}`,
          id: track.id
        }
        this.detailObject.push(detailTrack);
      });
      console.log('this took ' + (performance.now()-startTime) + ' ms');
    });
  }

  private generateTopArtistsData() {
    this.dataService.topArtists.subscribe((artists: Artist[]) => {
      this.podiumObject = [];
      this.detailObject = [];
      let podiumArtists = artists.slice(0, 3);
      let detailArtists = artists.slice(3, artists.length);

      podiumArtists.forEach((artist, index) => {
        let singleArtist: PodiumObject = {
          image: artist.images[0].url,
          title: artist.name,
          ranking: `#${index + 1}`,
        }
        this.podiumObject.push(singleArtist);
      });

      detailArtists.forEach((artist, index) => {
        let artistDetail: DetailObject = {
          firstLine: artist.name,
          secondLine: `# ${index + 4}`,
          id: artist.id,
          image: artist.images[1].url,
        }
        this.detailObject.push(artistDetail);
      });

    });
  }

  private generateRecentlyListenedData() {
    this.dataService.recentlyPlayed.subscribe((recents: PlayHistoryObject[]) => {
      this.podiumObject = [];
      let podiumRecents = recents.slice(0, 3);
      let detailRecents = recents.slice(3, recents.length);

      podiumRecents.forEach((recent) => {
        let artists = [];
        recent.track.artists.forEach(artist => { artists.push(artist.name) });

        let singleRecent: PodiumObject = {
          image: recent.track.album.images[0].url,
          title: recent.track.name,
          subtitle: artists.join(', '),
          additionalInfo: new Date(recent.played_at).toLocaleString().replace('-', '.')
        }
        this.podiumObject.push(singleRecent);
      });

      detailRecents.forEach(recent => {
        let artists = [];
        recent.track.artists.forEach(artist => { artists.push(artist.name) });

        let recentDetail: DetailObject = {
          image: recent.track.album.images[1].url,
          firstLine: recent.track.name,
          secondLine: artists.join(', '),
          thirdLine: new Date(recent.played_at).toLocaleString().replace('-', '.'),
          id: recent.track.id
        }
        this.detailObject.push(recentDetail);
      });
    });
  }

  private generatePodium(image: string, title: string, subtitle?: string, additionalInfo?: string, ranking?: string): PodiumObject {
    return {
      image: image,
      title: title,
      subtitle: subtitle,
      additionalInfo: additionalInfo,
      ranking: ranking
    }
  }

}
