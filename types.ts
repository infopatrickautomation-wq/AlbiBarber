
export enum BookingStatus {
  CONFIRMED = 'Confermato',
  PENDING = 'In attesa',
  COMPLETED = 'Completato',
  CANCELLED = 'Cancellato'
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  category: 'Classic' | 'Premium' | 'Other';
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  availability: string[]; // ['Lun', 'Mar', ...]
  color: string;
  imageUrl: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerSurname: string;
  phone: string;
  email?: string;
  notes?: string;
  barberId: string;
  serviceIds: string[];
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  totalPrice: number;
  totalDuration: number;
  status: BookingStatus;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  category: 'Taglio' | 'Barba' | 'Styling';
}

export interface WorkingHours {
  day: string;
  morning: { open: string; close: string };
  afternoon: { open: string; close: string };
}
