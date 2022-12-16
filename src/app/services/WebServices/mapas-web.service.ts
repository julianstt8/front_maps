import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MapasWebService {
  private url = `${environment.apiUrl}maps`;

  constructor(private http: HttpClient) { }

  public getMarkerById = (params: any) => this.http.get(`${this.url}/getMarkerById`, params);

  public deleteMarker = (params: any) => this.http.delete(`${this.url}/deleteMarker`, params);

  public editMarker = (params: any) => this.http.put(`${this.url}/editMarker`, params);

  public addMarker = (params: any) => this.http.post(`${this.url}/addMarker`, params);

  public getMarker = () => this.http.get(`${this.url}/getMarker`);
}
