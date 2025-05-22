import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { 
  faHome, 
  faCalendar, 
  faUsers, 
  faUser, 
  faCog, 
  faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,
    RouterLink,
    RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Assign icons to properties
  faHome = faHome;
  faCalendar = faCalendar;
  faUsers = faUsers;
  faUser = faUser;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
}