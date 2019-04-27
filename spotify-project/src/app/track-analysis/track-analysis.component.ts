import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';


@Component({
  selector: 'app-track-analysis',
  templateUrl: './track-analysis.component.html',
  styleUrls: ['./track-analysis.component.css']
})
export class TrackAnalysisComponent implements OnInit {
  private type: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      // this.type = parmas.;
    })

  }

}
