// models/event.model.ts
export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;  // or Date if you transform it
  location: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  created_by: string;
}

// models/monthly-stat.model.ts
export interface MonthlyStat {
  month: string;
  count: number;
}