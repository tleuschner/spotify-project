import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VisitorsService {

  private readonly apiVisitorUrl = environment.visitorsUrl;
  private visitorSubject$ = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient
  ) { }

  public getVisitors(): Observable<number> {
    return this.http.get<Visitors>(`${this.apiVisitorUrl}/visitors`).pipe(
      map(res => res.visitors)
    );
  }

  //TODO: check if succesful
  //TODO: retry if unsuccesful
  //TODO: add class 
  public postVisitor(spotifyID: string, country: string): Observable<HttpResponse<any>> {
    return this.http.post(`${this.apiVisitorUrl}/user`, {
      spotifyID: spotifyID,
      country: country
    }, {observe: 'response'})
  }
}

export class Visitors {
  visitors: number
}
