// models/event.model.ts
export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: Date | string;  // Explicitly allow both types
  location: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  created_by: string;
}
// models/monthly-stat.model.ts
export interface MonthlyStat {
  month: string;
  count: number;
}