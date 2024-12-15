import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
// import { AuthService } from '../common/auth/auth.service';
import Imeeting from './models/Imeeting';


@Injectable({
  providedIn: 'root'
})
export class MeetingsService {
  private apiUrl = "http://localhost:4000"; 
  constructor(private http: HttpClient) {}

  getMeetings() {
    return this.http.get<Imeeting[]>(`${this.apiUrl}/api/meetings`);
  }

  addMeeting(meetingData: Omit<Imeeting, 'id'>): Observable<Imeeting> {
    return this.http.post<Imeeting>(
      `${this.apiUrl}/api/meetings`, meetingData, {
        headers:{
          'Content-Type': 'application/json' 
        }
      }
    );
  }

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/teams`);
  }

  // Add a new team to the backend
  addTeam(teamData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/teams`, teamData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // getMeetingsById(meetingsId: number) {
  //   return this.http.get<Imeeting>(`${this.apiUrl}/workshops/${workshopId}`);
  // }

  // backendFiltering(categoryName: string){
  //   const params = new HttpParams().set('category', categoryName);
  //   return this.http.get<Imeeting[]>(`${this.apiUrl}/workshops`, { params });
  // }

  // putWorkshop(id: number, workshopData: Omit<Imeeting, 'id'>): Observable<Imeeting> {
  //   return this.http.put<Imeeting>(
  //     `${this.apiUrl}/workshops/${id}`,
  //     workshopData,
  //     {
  //       headers: { 'Content-Type': 'application/json' }
  //     }
  //   );
  // }
}


