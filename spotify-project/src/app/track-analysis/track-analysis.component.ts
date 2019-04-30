import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { TopTracks } from '../models/TopTracks';
import { AudioFeatures } from '../models/AudioFeatures';
import { Chart } from 'chart.js/dist/Chart.js'
import { Render3DebugRendererFactory2 } from '@angular/core/src/render3/debug';


@Component({
  selector: 'app-track-analysis',
  templateUrl: './track-analysis.component.html',
  styleUrls: ['./track-analysis.component.css']
})
export class TrackAnalysisComponent implements OnInit {
  @ViewChild('radarChart', { read: ElementRef }) radarChartCanvas: ElementRef;
  private type: string;
  private tracks: TopTracks[];
  private trackIds: string[];
  private audioFeatures: AudioFeatures[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.type = params.get('type');

      if (this.type === 'topTracks') {
        this.spotifyService.timeRange.subscribe(time => {
          this.spotifyService.getTopSongs('50', undefined, time).subscribe(res => {
            this.tracks = res;
            this.extractIds(this.tracks);
            this.spotifyService.getAudioFeatures(this.trackIds).subscribe(res => {
              this.audioFeatures = res;
              this.populateRadarChart(this.audioFeatures);
            })
          });
        });
      } //end if needs more
    });

  }

  private extractIds(tracks: any[]) {
    this.trackIds = [];
    for (const track of tracks) {
      this.trackIds.push(track.id);
    }
  }

  private populateRadarChart(features: AudioFeatures[]) {
    let ctx = this.radarChartCanvas.nativeElement;
    let data = {
      labels: ['Tanzbarkeit', 'Energie', 'Lautstärke', 'Speechiness', 'Akkustik', 'Instrumental', 'Lebhaftigkeit', 'Stimmung'],
      datasets: [{
        label: "nicer dicer",
        data: this.calculateAverages(features),
        fill: false,
        backgroundColor: 'transparent',
        pointRadius: 6,
        pointBackgroundColor: 'rgba(25, 20, 20, 1)',
        pointBorderColor: 'rgba(30, 215, 96, 0.3)',
        pointBorderWidth: 5,
      }]
    }

    let radarChar = new Chart(ctx, {
      type: 'radar',
      data: data,
    });
  }

  private calculateAverages(features: AudioFeatures[]) {
    let danceability = 0, energy = 0, loudness = 0, speechiness = 0, acousticness = 0, instrumentalness = 0, liveness = 0, valence = 0;
    // @ts-ignore
    let length = features.audio_features.length;
    let result = [];

    // @ts-ignore
    for (const feature of features.audio_features) {
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
    console.log(result);
    return result;
  }

}