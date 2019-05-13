import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { Chart } from 'chart.js/dist/Chart.js'
import { TopTracks, AudioFeatures, Playlist, Track } from '../models/SpotifyObjects';
import { ChartService } from '../services/chart.service';
import { DetailObject } from '../models/DetailObject';

@Component({
  selector: 'app-track-analysis',
  templateUrl: './track-analysis.component.html',
  styleUrls: ['./track-analysis.component.css']
})

export class TrackAnalysisComponent implements OnInit, OnDestroy {
  @ViewChild('radarChart', { read: ElementRef }) radarChartCanvas: ElementRef;
  @ViewChild('playlistDropdown', { read: ElementRef }) playlistDropdown: ElementRef;
  private type: string;
  private tracks: TopTracks[];
  private ids: string[];
  private audioFeatures: AudioFeatures[];
  private playlists: Playlist[];
  private radarChart: Chart;
  private trackDetails: DetailObject[] = [];
  private playlistDetails: DetailObject[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService,
    private chartService: ChartService
  ) { }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.type = params.get('type');

      if (this.type === 'topTracks') {
        this.spotifyService.timeRange.subscribe(time => {
          this.spotifyService.getTopSongs('50', undefined, time).subscribe(res => {
            this.tracks = res;
            this.extractIds(this.tracks);
            this.populateDetailObject(this.tracks);
            this.spotifyService.getAudioFeatures(this.ids).subscribe(res => {
              this.audioFeatures = res;
              //@ts-ignore
              this.populateRadarChart(this.audioFeatures.audio_features, 'Top Tracks');
            })
          });
        });
      } else if (this.type === 'playlist') {
        this.spotifyService.getPlaylists().subscribe(res => {
          this.playlists = res;
        });
      }
      //end if needs more
    });

  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true); //third parameter
  }

  scroll = (event: any): void => {
    //console.log(event.srcElement);
  };

  private populateDetailObject(tracks: any[]) {
    if (this.type === 'topTracks') {
      this.trackDetails = [];
      let i = 1;
      for (let track of tracks) {

        let artists = [];
        for (const artist of track.artists) {
          artists.push(artist.name);
        }

        this.trackDetails.push({
          image: track.album.images[0].url,
          firstLine: track.name,
          secondLine: artists.join(', '),
          thirdLine: "#" + i.toString(),
          id: track.id
        });
        i++;
      }
    } else if (this.type === 'playlist') {
      this.trackDetails = [];
      let i = 1;
      for(let trackList of tracks){
          let track = trackList.track;

          let artists = [];
          for (const artist of track.artists) {
            artists.push(artist.name);
          }

          this.trackDetails.push({
            image: track.album.images[0].url,
            firstLine: track.name,
            secondLine: artists.join(', '),
            thirdLine: "#" + i.toString(),
            id: track.id
          });
          i++;
        }
    }
  }

  private extractIds(tracks: any[]) {
    this.ids = [];
    for (const track of tracks) {
      this.ids.push(track.id);
    }
  }

  //TODO: refactor this
  async analysePlaylist(playlist: Playlist) {
    this.audioFeatures = [];
    this.playlistDropdown.nativeElement.innerText = playlist.name;

    this.spotifyService.getPlaylistTracks(playlist.id).then(async values => {
      console.log([].concat.apply([],values));
      for (let i = 0; i < values.length; i++) {
        let idChunk = values[i];
        let singleIds = [];
        for (const element of idChunk) {
          if (element.track) {
            singleIds.push(element.track.id);
          }
        }

        this.audioFeatures = this.audioFeatures.concat(await this.spotifyService.getAudioFeatures(singleIds).toPromise());

      }
      let temp: AudioFeatures[] = [];
      for (let i = 0; i < this.audioFeatures.length; i++) {
        //@ts-ignore
        for (const feature of this.audioFeatures[i].audio_features) {
          temp.push(feature);
        }
      }
      this.audioFeatures = temp;

      this.populateRadarChart(this.audioFeatures, playlist.name);
      this.populateDetailObject([].concat.apply([], values));
      //Get Tracks of a selected Playlist
      // this.spotifyService.getTracksOfAPlaylist(playlist.tracks.href).subscribe(async value => {
      //   console.log(value);
      //   this.extractIds(value);
      //   this.populateDetailObject(value);
      // });
    });
  }

  private populateRadarChart(features: AudioFeatures[], label: string) {
    let ctx = this.radarChartCanvas.nativeElement;
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

    this.radarChart = new Chart(ctx, {
      type: 'radar',
      data: data,
    });
    this.chartService.setChart(this.radarChart);
  }

  private calculateAverages(features: AudioFeatures[]) {
    let danceability = 0, energy = 0, loudness = 0, speechiness = 0, acousticness = 0, instrumentalness = 0, liveness = 0, valence = 0;
    // @ts-ignore
    let length = features.length;
    let result = [];

    // @ts-ignore
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

}
