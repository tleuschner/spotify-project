import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { Track, Artist, PlayHistoryObject, AudioFeatures, Playlist } from '../models/SpotifyObjects';
import { PodiumObject } from '../models/PodiumObject';
import { DetailObject } from '../models/DetailObject';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css']
})
export class DetailViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('displayChart', { read: ElementRef }) chartCanvas?: ElementRef;
  @ViewChild('playlistDropdown', { read: ElementRef }) playlistDropdown?: ElementRef;
  public type: string;
  public title: string = '';
  public podium = false;
  public chart = false;
  public playlist = false;
  public sticky = false;
  public done = false;
  private elementPos: any;
  public radarChart: Chart;
  private topTracks: Track[];
  private topArtists: Artist[];
  public audioFeatures: AudioFeatures[];
  public podiumObject: PodiumObject[] = [];
  public detailObject: DetailObject[] = [];
  public playlists: Playlist[];
  private unsubscribe$ = new Subject<void>();


  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService,
    private chartService: ChartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe((params: ParamMap) => {
      this.type = params.get('id');
      if (this.type === 'tracks' || this.type === 'artists' || this.type === 'recents') {
        this.podium = true;
      } else {
        this.podium = false;
        this.chart = false;
      }

      switch (this.type) {
        case 'tracks':
          this.chart = true;
          this.title = "Top Tracks";
          this.generateTopTrackData();
          break;
        case 'artists':
          this.chart = false;
          this.playlist = false;
          this.generateTopArtistsData();
          this.title = "Top Künstler";
          break;
        case 'recents':
          this.generateRecentlyListenedData();
          this.chart = true;
          this.title = "Zuletzt gehört";
          break;
        case 'genres':
          break;
        case 'playlist':
          this.title = 'Playlist Analyse'
          this.chart = this.playlist = true;
          this.getPlaylists();
          break;
        default:
          this.router.navigate([''])
          break;
      }
    });

    this.spotifyService.timeRange.pipe(takeUntil(this.unsubscribe$)).subscribe(time => {
      this.dataService.updateData(time);
    });
  }

  ngAfterViewInit() {
    if (this.chartCanvas) {
      let element: DOMRect = this.chartCanvas.nativeElement.getBoundingClientRect();
      this.elementPos = element.y + 52 ;
    }
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= this.elementPos) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }

  public analysePlaylist(playlist: Playlist) {
    this.playlistDropdown.nativeElement.innerText = playlist.name;
    this.detailObject = [];

    this.spotifyService.getPlaylistTracks(playlist.id).then((value: any[]) => {
      let tracks: Track[] = [];
      value = this.flattenArray(value);
      value.forEach(item => { tracks.push(item.track) });
      let ids = this.extractIds(tracks);

      this.getAudioFeatures(ids).then(
        (onFullfilled) => {
          let audioFeatures = this.flattenArray(onFullfilled)[0].audio_features;
          this.generateChart(audioFeatures, playlist.name);
        }
      );

      tracks.forEach((track, index) => {
        let artists = [];
        track.artists.forEach(artist => { artists.push(artist.name) });

        this.detailObject.push({
          image: track.album.images[0].url,
          firstLine: track.name,
          secondLine: artists.join(', '),
          id: track.id
        });

      });


    })
  }

  private generateTopTrackData() {
    this.dataService.topTracks.pipe(takeUntil(this.unsubscribe$)).subscribe((tracks: Track[]) => {
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
          id: track.id
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

      let ids = this.extractIds(tracks);
      this.getAudioFeatures(ids).then(
        (onFullfilled) => {
          let audioFeatures = this.flattenArray(onFullfilled)[0].audio_features;
          this.generateChart(audioFeatures, 'Top Tracks');
        }
      );


    });
  }

  private generateTopArtistsData() {
    this.dataService.topArtists.pipe(takeUntil(this.unsubscribe$)).subscribe((artists: Artist[]) => {
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
    this.dataService.recentlyPlayed.pipe(takeUntil(this.unsubscribe$)).subscribe((recents: PlayHistoryObject[]) => {
      this.podiumObject = [];
      let ids: string[] = [];
      let podiumRecents = recents.slice(0, 3);
      let detailRecents = recents.slice(3, recents.length);

      podiumRecents.forEach((recent) => {
        let artists = [];
        recent.track.artists.forEach(artist => { artists.push(artist.name) });
        ids.push(recent.track.id);

        let singleRecent: PodiumObject = {
          image: recent.track.album.images[0].url,
          title: recent.track.name,
          subtitle: artists.join(', '),
          additionalInfo: new Date(recent.played_at).toLocaleString().replace('-', '.'),
          id: recent.track.id
        }
        this.podiumObject.push(singleRecent);
      });

      detailRecents.forEach(recent => {
        ids.push(recent.track.id);
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

        this.getAudioFeatures(ids).then(
          (onFullfilled) => {
            let audioFeatures = this.flattenArray(onFullfilled)[0].audio_features;
            this.generateChart(audioFeatures, 'Zuletzt gehört');
          }
        );

      });
    });
  }

  private getPlaylists() {
    this.spotifyService.getPlaylists().pipe(takeUntil(this.unsubscribe$)).subscribe((playlist: Playlist[]) => {
      this.playlists = playlist;
    });
  }

  private extractIds(tracks: Track[]): string[] {
    let ids: string[] = [];
    for (const track of tracks) {
      ids.push(track.id);
    }
    return ids;
  }

  private getAudioFeatures(trackIds: string[]): Promise<AudioFeatures[]> {
    let i, j, k = 0;
    let chunk = 100;
    let promises = [];
    for (i = 0, j = trackIds.length; i < j; i += chunk) {
      let ids = trackIds.slice(i, i + chunk);
      promises.push(new Promise((resolve, reject) => {
        this.spotifyService.getAudioFeatures(ids).toPromise().then(
          (onFullfilled) => {
            resolve(onFullfilled);
          }, (onReject) => {
            console.error(onReject);
          }
        );
      })
      );
    }
    return Promise.all(promises);
  }

  private generateChart(features: AudioFeatures[], label: string) {
    let ctx = this.chartCanvas.nativeElement;
    let data = {
      labels: ['Tanzbarkeit', 'Energie', 'Lautstärke', 'Speechiness', 'Akkustik', 'Instrumental', 'Lebhaftigkeit', 'Stimmung'],
      datasets: [{
        label: label,
        data: this.calculateAverages(features),
        fill: true,
        backgroundColor: '#1db95450',
        pointBackgroundColor: 'rgba(25, 20, 20, 1)',
        pointBorderColor: 'rgba(30, 215, 96, 0.3)',
      }],
    }
    this.radarChart = new Chart(ctx, {
      type: 'radar',
      data: data,
    });
    this.chartService.setChart(this.radarChart);
  }

  private calculateAverages(features: AudioFeatures[]) {
    let danceability = 0, energy = 0, loudness = 0, speechiness = 0, acousticness = 0, instrumentalness = 0, liveness = 0, valence = 0;
    let length = features.length;
    let result = [];

    for (const feature of features) {
      danceability += feature.danceability;
      energy += feature.energy;
      loudness += feature.loudness / -60;
      speechiness += feature.speechiness;
      acousticness += feature.acousticness;
      instrumentalness += feature.instrumentalness;
      liveness += feature.liveness;
      valence += feature.valence;
    }
    let temp = [danceability, energy, loudness, speechiness, acousticness, instrumentalness, liveness, valence];
    for (const feature of temp) {
      result.push(feature / length);
    }
    //Lautstärke besser anzeigen
    result[2] = 1 - result[2];
    return result;
  }

  private flattenArray(array): [any] {
    return [].concat.apply([], array);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
