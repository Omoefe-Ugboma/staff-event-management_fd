import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Event } from '../models/event.model';
import { environment } from '../../environments/environment';
import { catchError} from 'rxjs/operators';
import { MonthlyStat } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  // getMonthlyEventStats(currentYear: number): any {
  //   throw new Error('Method not implemented.');
  // }
  getMonthlyEventStats(year: number): Observable<MonthlyStat[]> {
    return this.http.get<{stats: MonthlyStat[]}>(
      `${this.apiUrl}/stats?year=${year}`
    ).pipe(
      map(response => response.stats || []),
      catchError(() => of([]))
    );
  }
  
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<{events: Event[]}>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.events || []),
        map(events => events.map(event => this.transformEvent(event)))
      );
  }


  
  getEvent(id: string): Observable<Event> {
    return this.http.get<{event: Event}>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.event),
        map(event => this.transformEvent(event))
      );
  }

  createEvent(eventData: Omit<Event, 'id'>): Observable<Event> {
    return this.http.post<{event: Event}>(this.apiUrl, eventData, { headers: this.getHeaders() })
      .pipe(
        map(response => this.transformEvent(response.event))
      );
  }

  updateEvent(id: string, eventData: Partial<Event>): Observable<Event> {
    return this.http.put<{event: Event}>(`${this.apiUrl}/${id}`, eventData, { headers: this.getHeaders() })
      .pipe(
        map(response => this.transformEvent(response.event))
      );
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  private transformEvent(event: any): Event {
    return {
      ...event,
      event_date: new Date(event.event_date) // Convert string to Date object
    };
  }
  
}