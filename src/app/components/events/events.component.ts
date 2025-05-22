import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  showEventForm = false;
  eventForm: FormGroup;
  isEditing = false;
  currentEventId: string | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      event_date: ['', Validators.required],  // Matches API field name
      location: [''],
      status: ['Upcoming', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = [...events];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load events. Please try again.';
        this.isLoading = false;
        console.error('Error loading events:', err);
      }
    });
  }

  openEventForm(event?: Event): void {
    this.showEventForm = true;
    if (event) {
      this.isEditing = true;
      this.currentEventId = event.id;
      this.eventForm.patchValue({
        title: event.title,
        description: event.description,
        event_date: this.formatDateForInput(event.event_date),
        location: event.location,
        status: event.status
      });
    } else {
      this.isEditing = false;
      this.currentEventId = null;
      this.eventForm.reset({
        status: 'Upcoming'
      });
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.isLoading = true;
      const formData = this.eventForm.value;

      // Convert date to ISO string for API
      const eventData = {
        ...formData,
        event_date: new Date(formData.event_date).toISOString()
      };

      if (this.isEditing && this.currentEventId) {
        this.eventService.updateEvent(this.currentEventId, eventData).subscribe({
          next: () => {
            this.loadEvents();
            this.closeEventForm();
          },
          error: (err) => {
            this.errorMessage = 'Failed to update event. Please try again.';
            this.isLoading = false;
            console.error('Error updating event:', err);
          }
        });
      } else {
        this.eventService.createEvent(eventData).subscribe({
          next: () => {
            this.loadEvents();
            this.closeEventForm();
          },
          error: (err) => {
            this.errorMessage = 'Failed to create event. Please try again.';
            this.isLoading = false;
            console.error('Error creating event:', err);
          }
        });
      }
    }
  }

  deleteEvent(id: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.isLoading = true;
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.loadEvents();
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete event. Please try again.';
          this.isLoading = false;
          console.error('Error deleting event:', err);
        }
      });
    }
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    return d.toISOString().slice(0, 16);
  }

  closeEventForm(): void {
    this.showEventForm = false;
    this.eventForm.reset();
    this.isLoading = false;
  }
}