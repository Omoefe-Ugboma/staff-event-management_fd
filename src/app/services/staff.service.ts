import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Staff } from '../models/staff.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = `${environment.apiUrl}/staff`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // getStaff(): Observable<Staff[]> {
  //   return this.http.get<Staff[]>(this.apiUrl, { headers: this.getHeaders() });
  // }

  // getStaffMember(id: string): Observable<Staff> {
  //   return this.http.get<Staff>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  // }

  // createStaff(staff: Omit<Staff, 'id'>): Observable<Staff> {
  //   return this.http.post<Staff>(this.apiUrl, staff, { headers: this.getHeaders() });
  // }

  // updateStaff(id: string, staff: Partial<Staff>): Observable<Staff> {
  //   return this.http.put<Staff>(`${this.apiUrl}/${id}`, staff, { headers: this.getHeaders() });
  // }

  // deleteStaff(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  // }

  
  getStaff(): Observable<Staff[]> {
    return this.http.get<{staff: Staff[]}>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(map(response => response.staff || []));
  }

  createStaff(staffData: Omit<Staff, 'id' | 'user_id' | 'username'>): Observable<Staff> {
    return this.http.post<Staff>(this.apiUrl, staffData, { headers: this.getHeaders() });
  }

  updateStaff(id: string, staffData: Partial<Staff>): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/${id}`, staffData, { headers: this.getHeaders() });
  }

  deleteStaff(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  
  searchStaff(query: string): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.apiUrl}/search`, { 
      headers: this.getHeaders(),
      params: { q: query }
    });
  }
}