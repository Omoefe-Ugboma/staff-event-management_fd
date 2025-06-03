import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MonthlyStat {
  month: number;
  month_name: string;
  events: {
    total: number;
    completed: number;
    cancelled: number;
    avg_attendees: number;
  };
  finance: {
    total_revenue: number;
    avg_payment: number;
    payment_count: number;
  };
  staff: {
    assignments: number;
    unique_staff: number;
  };
}

export interface YearComparison {
  previous_year: number;
  event_growth: number;
  revenue_growth: number;
  top_months: {
    month: number;
    month_name: string;
    event_count: number;
    total_attendees: number;
  }[];
}

export interface MonthlyStatsResponse {
  year: number;
  monthly_data: MonthlyStat[];
  year_summary: {
    totals: {
      total_events: number;
      completed_events: number;
      cancelled_events: number;
      total_revenue: number;
      total_payments: number;
      total_assignments: number;
    };
    averages: {
      avg_attendees: number;
      avg_payment: number;
    };
  };
  comparison: YearComparison;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = `${environment.apiUrl}/stats/monthly`;

  constructor(private http: HttpClient) { }

  getMonthlyStats(year?: number): Observable<MonthlyStatsResponse> {
    const params = new HttpParams();
    if (year) {
      params.set('year', year.toString());
    }
    return this.http.get<MonthlyStatsResponse>(this.apiUrl, { params });
  }

  // Additional statistical endpoints
  getEventTypeDistribution(year?: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/stats/event-types`, {
      params: year ? { year: year.toString() } : {}
    });
  }

  getAttendanceTrends(year?: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/stats/attendance`, {
      params: year ? { year: year.toString() } : {}
    });
  }
}