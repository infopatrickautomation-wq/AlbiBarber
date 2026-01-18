
import { Service, Barber, WorkingHours } from './types';

export const SERVICES: Service[] = [
  { id: '1', name: 'Taglio Uomo Classic', duration: 30, price: 18, category: 'Classic' },
  { id: '2', name: 'Taglio Uomo Styling', duration: 45, price: 25, category: 'Classic' },
  { id: '3', name: 'Taglio Bambino (0-12 anni)', duration: 25, price: 14, category: 'Classic' },
  { id: '4', name: 'Taglio Ragazzo (13-17 anni)', duration: 30, price: 16, category: 'Classic' },
  { id: '5', name: 'Barba Completa', duration: 30, price: 15, category: 'Classic' },
  { id: '6', name: 'Barba Rifinitura', duration: 15, price: 10, category: 'Classic' },
  { id: '7', name: 'Taglio + Barba Completa', duration: 50, price: 30, category: 'Classic' },
  { id: '8', name: 'Taglio + Barba Rifinitura', duration: 40, price: 25, category: 'Classic' },
  { id: '9', name: 'Shampoo + Piega', duration: 20, price: 12, category: 'Classic' },
  { id: '10', name: 'Trattamento Anticaduta', duration: 30, price: 20, category: 'Classic' },
  { id: '11', name: 'Colorazione Barba', duration: 25, price: 18, category: 'Classic' },
  { id: '12', name: 'Rasatura Completa', duration: 20, price: 12, category: 'Classic' },
  // Premium
  { id: '13', name: 'Royal Treatment', duration: 75, price: 50, category: 'Premium' },
  { id: '14', name: 'Trattamento Viso Uomo', duration: 40, price: 35, category: 'Premium' },
  { id: '15', name: 'Disegno Barba/Capelli', duration: 20, price: 15, category: 'Premium' },
  { id: '16', name: 'Colorazione Capelli Uomo', duration: 60, price: 40, category: 'Premium' },
];

export const TEAM: Barber[] = [
  { 
    id: 'alberto', 
    name: 'Alberto', 
    role: 'Titolare / Barbiere Senior', 
    availability: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'], 
    color: '#D5963B',
    imageUrl: 'https://picsum.photos/seed/alberto/200'
  },
  { 
    id: 'marco', 
    name: 'Marco', 
    role: 'Barbiere', 
    availability: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'], 
    color: '#3B82F6',
    imageUrl: 'https://picsum.photos/seed/marco/200'
  },
  { 
    id: 'luca', 
    name: 'Luca', 
    role: 'Barbiere', 
    availability: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'], 
    color: '#10B981',
    imageUrl: 'https://picsum.photos/seed/luca/200'
  },
  { 
    id: 'simone', 
    name: 'Simone', 
    role: 'Barbiere', 
    availability: ['Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'], 
    color: '#EF4444',
    imageUrl: 'https://picsum.photos/seed/simone/200'
  },
];

export const OPENING_HOURS: Record<string, WorkingHours> = {
  'Lunedì': { day: 'Lunedì', morning: { open: '09:00', close: '13:00' }, afternoon: { open: '14:30', close: '19:00' } },
  'Martedì': { day: 'Martedì', morning: { open: '09:00', close: '13:00' }, afternoon: { open: '14:30', close: '19:00' } },
  'Mercoledì': { day: 'Mercoledì', morning: { open: '09:00', close: '13:00' }, afternoon: { open: '14:30', close: '19:00' } },
  'Giovedì': { day: 'Giovedì', morning: { open: '09:00', close: '13:00' }, afternoon: { open: '14:30', close: '19:00' } },
  'Venerdì': { day: 'Venerdì', morning: { open: '09:00', close: '13:00' }, afternoon: { open: '14:30', close: '19:00' } },
  'Sabato': { day: 'Sabato', morning: { open: '08:30', close: '13:00' }, afternoon: { open: '14:00', close: '18:00' } },
  'Domenica': { day: 'Domenica', morning: { open: 'CHIUSO', close: 'CHIUSO' }, afternoon: { open: 'CHIUSO', close: 'CHIUSO' } },
};
