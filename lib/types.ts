// ETABLE Types

export type GuestStatus = 'WAITING' | 'CALLING' | 'GUIDING' | 'HOLD' | 'COMPLETED' | 'CANCELLED';

export type SeatType = 'TABLE' | 'COUNTER' | 'ANY';

export type NotificationMethod = 'LINE' | 'EMAIL';

export interface Guest {
  id: string;
  number: number;
  partySize: number;
  seatType: SeatType;
  status: GuestStatus;
  notificationMethod?: NotificationMethod;
  calledAt?: number;
  guidedAt?: number;
  holdAt?: number;
  createdAt: number;
}

export interface BusinessHours {
  id: string;
  days: string[];
  startTime: string;
  endTime: string;
}

export interface ClosedDay {
  id: string;
  type: 'weekly' | 'specific';
  day?: string; // For weekly (月, 火, etc.)
  week?: number; // For specific week (1-4)
  weekday?: string; // For specific weekday
}

export interface Settings {
  businessHours: BusinessHours[];
  closedDays: ClosedDay[];
  acceptingReservations: boolean;
  todayClosed: boolean;
  callMessage: string;
  autoCancelMinutes: number;
}

export interface DailyRecord {
  date: string;
  totalGuided: number;
  hasData: boolean;
}

export type AppScreen = 
  | 'login'
  | 'closed'
  | 'dashboard'
  | 'history'
  | 'analytics'
  | 'reviews'
  | 'settings'
  | 'daily-result'
  | 'summary';

export type FilterTab = 'all' | '1-2' | 'table' | 'counter';
