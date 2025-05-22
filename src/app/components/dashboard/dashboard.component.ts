import { Component, OnInit } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { StaffService } from '../../services/staff.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event } from '../../models/event.model';
import { Staff } from '../../models/staff.model';

interface MonthlyStat {
  month: string;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, NavbarComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  chart: Chart | undefined;
  totalEvents = 0;
  activeStaff = 0;
  pendingRequests = 0;
  systemUptime = '99.9%';
  recentActivities: string[] = [];
  isLoading = true;
  errorMessage = '';
  currentYear = new Date().getFullYear();
  isDarkMode: any;



  constructor(
    public authService: AuthService,
    private eventService: EventService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      events: this.eventService.getEvents().pipe(catchError(() => of([]))),
      staff: this.staffService.getStaff().pipe(catchError(() => of([]))),
      monthlyStats: this.eventService.getMonthlyEventStats(this.currentYear).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ events, staff, monthlyStats }) => {
        this.totalEvents = events.length;
        this.activeStaff = staff.length;
        this.processMonthlyStats(monthlyStats);
        this.getRecentActivities(events);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Dashboard error:', err);
        this.errorMessage = 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private processMonthlyStats(stats: MonthlyStat[]): void {
    // Default months data
    const allMonths = [
      { month: 'Jan', count: 0 },
      { month: 'Feb', count: 0 },
      { month: 'Mar', count: 0 },
      { month: 'Apr', count: 0 },
      { month: 'May', count: 0 },
      { month: 'Jun', count: 0 },
      { month: 'Jul', count: 0 },
      { month: 'Aug', count: 0 },
      { month: 'Sep', count: 0 },
      { month: 'Oct', count: 0 },
      { month: 'Nov', count: 0 },
      { month: 'Dec', count: 0 }
    ];

    // Merge with actual stats
    const mergedStats = allMonths.map(defaultMonth => {
      const foundStat = stats.find(s => s.month === defaultMonth.month);
      return foundStat || defaultMonth;
    });

    // Create the chart
    this.chart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Monthly Event Statistics'
      },
      xAxis: {
        categories: mergedStats.map(s => s.month),
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Number of Events'
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Events',
        data: mergedStats.map(s => s.count),
        type: 'column',
        color: '#3498db'
      }],
      credits: {
        enabled: false
      }
    });
  }

  private getRecentActivities(events: Event[]): void {
    // Get 5 most recent events
    const recentEvents = [...events]
      .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
      .slice(0, 5);

    this.recentActivities = recentEvents.map(event => 
      `New event created: "${event.title}" on ${new Date(event.event_date).toLocaleDateString()}`
    );

    // Fill with default activities if needed
    const defaultActivities = [
      'System maintenance completed',
      'New staff training session scheduled',
      'Database backup performed',
      'Security audit passed'
    ];

    while (this.recentActivities.length < 5) {
      this.recentActivities.push(
        defaultActivities[this.recentActivities.length % defaultActivities.length]
      );
    }
  }

  toggleDarkMode(): void {
    document.body.classList.toggle('dark-mode');
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}