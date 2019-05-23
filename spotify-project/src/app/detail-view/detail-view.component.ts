import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { Track, Artist, PlayHistoryObject, AudioFeatures } from '../models/SpotifyObjects';
import { PodiumObject } from '../models/PodiumObject';
import { DetailObject } from '../models/DetailObject';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css']
})
export class DetailViewComponent implements OnInit, OnDestroy {
  @ViewChild('displayChart', { read: ElementRef }) chartCanvas: ElementRef;
  private type: string;
  public false = false;
  public title: string = '';
  public podium = false;
  public chart = false;
  private topTracks: Track[];
  private topArtists: Artist[];
  public podiumObject: PodiumObject[] = [];
  public detailObject: DetailObject[] = [];
  private unsubscribe$ = new Subject<void>();


  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService,
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
          // this.generateChart();
          break;
        case 'artists':
          this.generateTopArtistsData();
          this.title = "Top Künstler";
          break;
        case 'recents':
          this.generateRecentlyListenedData();
          this.chart = true;
          this.title = "Zuletzt gehört";
          break;
        case 'genres':
          console.log('nice');
          break;
        case 'playlist':
          this.chart = true;
          console.log('nice');
        default:
          this.router.navigate(['/404'])
          break;
      }
    });

    this.spotifyService.timeRange.pipe(takeUntil(this.unsubscribe$)).subscribe(time => {
      this.dataService.updateData(time);
    });
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
      }]
    }
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
