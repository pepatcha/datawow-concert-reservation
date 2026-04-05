export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Concert {
  id: number;
  name: string;
  description: string;
  totalSeats: number;
  reservedSeats: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: number;
  user: User;
  concert: Concert;
  createdAt: string;
}

export interface ReservationLog {
  id: number;
  user: User;
  concert: Concert;
  action: 'reserve' | 'cancel';
  createdAt: string;
}

export interface Stats {
  totalConcerts: number;
  totalSeats: number;
  totalReserved: number;
  totalCancelled: number;
}
