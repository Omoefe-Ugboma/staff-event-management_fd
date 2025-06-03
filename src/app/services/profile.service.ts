import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  role: string;
  last_login: string;
  created_at: string;
  metadata: any;
}

export interface ProfileStats {
  events_created: number;
  staff_members: number;
  last_activity: string;
}

export interface ActivityLog {
  action: string;
  timestamp: string;
  details: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getProfile(): Observable<{
    profile: UserProfile;
    stats: ProfileStats;
    activity_history: ActivityLog[];
  }> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
  }

  updateProfile(updates: any): Observable<{ message: string, updated_fields: string[] }> {
    return this.http.put<any>(this.apiUrl, updates, { headers: this.getHeaders() });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.updateProfile({
      current_password: currentPassword,
      password: newPassword
    });
  }
}