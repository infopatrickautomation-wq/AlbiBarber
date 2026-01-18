
import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { 
  Calendar, 
  Scissors, 
  Users, 
  LayoutDashboard, 
  Home, 
  Settings, 
  Menu, 
  X, 
  Clock, 
  MapPin, 
  Phone,
  ArrowRight,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Image as ImageIcon,
  LogOut,
  Lock,
  User,
  Activity,
  Plus,
  Edit2,
  Save,
  Info,
  Globe,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { SERVICES as INITIAL_SERVICES, TEAM as INITIAL_TEAM, OPENING_HOURS } from './constants';
import { Booking, BookingStatus, Service, Barber } from './types';
import { format, addDays, isSameDay, parseISO, startOfToday, addMinutes, isAfter } from 'date-fns';
import { it } from 'date-fns/locale';
import { sendWebhook, WebhookPayload } from './webhookService';

// --- SHARED COMPONENTS ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Prenota', path: '/booking', icon: Calendar },
    { name: 'Portfolio', path: '/portfolio', icon: ImageIcon },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gold-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Scissors className="text-black w-6 h-6" />
            </div>
            <span className="font-serif text-2xl font-black tracking-tighter text-white uppercase">
              ALBI<span className="text-gold-500">BARBER</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-medium transition-all hover:text-gold-500 ${
                  location.pathname === link.path ? 'text-gold-500' : 'text-gray-400'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </div>

          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-white/10 py-6 px-4 space-y-4 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl text-gray-300 bg-white/5 hover:bg-gold-600/10 hover:text-white transition-all"
            >
              <link.icon className="w-5 h-5" />
              <span className="font-bold">{link.name}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

const AdminSidebar = ({ onLogout }: { onLogout: () => void }) => {
  const location = useLocation();
  const links = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Calendario', path: '/admin/calendar', icon: Calendar },
    { name: 'Servizi', path: '/admin/services', icon: Scissors },
    { name: 'Team', path: '/admin/team', icon: Users },
    { name: 'Impostazioni', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-white/5 p-6 space-y-10 hidden lg:block sticky top-0 h-screen">
      <Link to="/" className="flex items-center gap-2 mb-10 group">
        <Scissors className="text-gold-500 w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="font-serif text-xl font-black text-white uppercase tracking-tighter">AlbiBarber</span>
      </Link>
      <nav className="space-y-3">
        {links.map(link => {
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.path}
              to={link.path} 
              className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                isActive 
                  ? 'bg-gold-600 text-black shadow-lg shadow-gold-600/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="pt-10">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
};

const Footer = () => (
  <footer className="bg-zinc-950 border-t border-white/5 py-24 px-4">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
      <div className="col-span-2 space-y-8">
        <Link to="/" className="flex items-center gap-2">
          <Scissors className="text-gold-500 w-8 h-8" />
          <span className="font-serif text-3xl font-black text-white">ALBI<span className="text-gold-500">BARBER</span></span>
        </Link>
        <p className="text-gray-500 max-w-sm text-lg leading-relaxed">
          Il tuo stile, un click di distanza. Prenota online il tuo prossimo taglio o trattamento barba. 
          Siamo pronti a darti il look che meriti con professionalità e passione dal 2010.
        </p>
      </div>
      <div>
        <h5 className="font-bold mb-8 text-gold-500 uppercase tracking-widest text-sm">Navigazione</h5>
        <ul className="space-y-4 text-gray-500">
          <li><Link to="/" className="hover:text-white transition-colors">Home Page</Link></li>
          <li><Link to="/booking" className="hover:text-white transition-colors">Prenota Ora</Link></li>
          <li><Link to="/portfolio" className="hover:text-white transition-colors">I Nostri Lavori</Link></li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold mb-8 text-gold-500 uppercase tracking-widest text-sm">Informazioni</h5>
        <ul className="space-y-4 text-gray-500">
          <li className="hover:text-white cursor-pointer transition-colors">Privacy & GDPR</li>
          <li><Link to="/login" className="hover:text-white transition-colors">Area Riservata Staff</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 text-center text-gray-600 text-sm">
      &copy; 2026 AlbiBarber System.
    </div>
  </footer>
);

// --- HOME VIEW ---
const HomeView = () => (
  <div className="animate-in fade-in duration-1000">
    <header className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-30 grayscale" 
          alt="Barbershop Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <span className="inline-block px-6 py-2 bg-gold-600/10 text-gold-500 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-gold-500/20">Established 2010</span>
        <h1 className="text-7xl md:text-[10rem] font-black leading-[0.8] uppercase tracking-tighter mb-10 font-serif italic">
          Mastering <br /> <span className="text-gold-500">The Style</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Più di un semplice taglio. Un'esperienza di grooming superiore nel cuore della città.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/booking" className="group bg-gold-600 hover:bg-gold-500 text-black px-12 py-6 rounded-full font-black text-sm tracking-widest uppercase transition-all flex items-center gap-3 shadow-2xl shadow-gold-600/20">
            Prenota Ora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/portfolio" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-6 rounded-full font-black text-sm tracking-widest uppercase transition-all backdrop-blur-md">
            I Nostri Lavori
          </Link>
        </div>
      </div>
    </header>

    <section className="py-32 px-4 max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
      {[
        { icon: Scissors, title: "Taglio Sartoriale", desc: "Ogni taglio è studiato sulla fisionomia del tuo viso." },
        { icon: Clock, title: "Rapidità & Qualità", desc: "Gestione ottimale dei tempi senza mai sacrificare i dettagli." },
        { icon: MapPin, title: "Posizione Centrale", desc: "Facilmente raggiungibili con ampio parcheggio riservato." }
      ].map((item, i) => (
        <div key={i} className="space-y-6 group">
          <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center group-hover:bg-gold-600 transition-all duration-500">
            <item.icon className="text-gold-500 w-8 h-8 group-hover:text-black transition-colors" />
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tighter">{item.title}</h3>
          <p className="text-gray-500 text-lg leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </section>
  </div>
);

// --- BOOKING FLOW ---
const BookingFlow = ({ services, onComplete, initialData }: { services: Service[], onComplete: (b: Booking) => void, initialData?: Partial<Booking> }) => {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>(initialData?.serviceIds || []);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(initialData?.barberId || null);
  const [selectedDate, setSelectedDate] = useState<Date>(initialData?.date ? parseISO(initialData.date) : startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(initialData?.time || null);
  const [customer, setCustomer] = useState({ 
    name: initialData?.customerName || '', 
    surname: initialData?.customerSurname || '', 
    phone: initialData?.phone || '', 
    email: initialData?.email || '', 
    notes: initialData?.notes || '' 
  });

  const currentServices = services.filter(s => selectedServices.includes(s.id));
  const totalPrice = currentServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = currentServices.reduce((acc, s) => acc + s.duration, 0);

  const generateTimeSlots = () => {
    const slots = [];
    let current = new Date();
    current.setHours(9, 0, 0, 0);
    const end = new Date();
    end.setHours(19, 0, 0, 0);

    while (current < end) {
      slots.push(format(current, 'HH:mm'));
      current = addMinutes(current, 30);
    }
    return slots;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarber || !selectedTime) return;

    const booking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: customer.name,
      customerSurname: customer.surname,
      phone: customer.phone,
      email: customer.email,
      notes: customer.notes,
      barberId: selectedBarber,
      serviceIds: selectedServices,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      totalPrice,
      totalDuration,
      status: BookingStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    onComplete(booking);
  };

  return (
    <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto min-h-[80vh]">
      <div className="mb-16 flex items-center justify-between border-b border-white/10 pb-10">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-tighter">Prenotazione</h2>
          <p className="text-gray-500 font-medium">Step {step} di 4</p>
        </div>
        <div className="flex gap-2">
          {[1,2,3,4].map(s => (
            <div key={s} className={`w-3 h-3 rounded-full ${step >= s ? 'bg-gold-500' : 'bg-zinc-800'}`}></div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
          <h3 className="text-3xl font-black uppercase tracking-tight">Scegli i servizi</h3>
          <div className="grid gap-4">
            {services.map(s => (
              <button 
                key={s.id}
                onClick={() => setSelectedServices(prev => prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id])}
                className={`p-6 rounded-3xl border text-left transition-all flex justify-between items-center ${selectedServices.includes(s.id) ? 'bg-gold-600 border-gold-600 text-black' : 'bg-zinc-900/50 border-white/5 hover:border-white/20'}`}
              >
                <div>
                  <h4 className="font-black uppercase tracking-tighter text-xl">{s.name}</h4>
                  <p className={`text-sm font-bold ${selectedServices.includes(s.id) ? 'text-black/60' : 'text-gray-500'}`}>{s.duration} min</p>
                </div>
                <span className="text-xl font-black">€{s.price}</span>
              </button>
            ))}
          </div>
          <button 
            disabled={selectedServices.length === 0}
            onClick={() => setStep(2)}
            className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-widest disabled:opacity-20 transition-all mt-10"
          >
            Continua
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
          <h3 className="text-3xl font-black uppercase tracking-tight">Scegli il Barbiere</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {INITIAL_TEAM.map(b => (
              <button 
                key={b.id}
                onClick={() => setSelectedBarber(b.id)}
                className={`p-8 rounded-[2.5rem] border text-center transition-all ${selectedBarber === b.id ? 'bg-gold-600 border-gold-600 text-black' : 'bg-zinc-900/50 border-white/5 hover:border-white/20'}`}
              >
                <img src={b.imageUrl} className="w-24 h-24 rounded-full mx-auto mb-6 grayscale border-4 border-white/10" alt={b.name} />
                <h4 className="font-black uppercase tracking-tighter text-2xl">{b.name}</h4>
                <p className={`text-xs font-black uppercase tracking-widest ${selectedBarber === b.id ? 'text-black/60' : 'text-gray-500'}`}>{b.role}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-4 pt-10">
            <button onClick={() => setStep(1)} className="flex-1 bg-zinc-900 py-6 rounded-full font-black uppercase tracking-widest border border-white/5">Indietro</button>
            <button disabled={!selectedBarber} onClick={() => setStep(3)} className="flex-1 bg-white text-black py-6 rounded-full font-black uppercase tracking-widest disabled:opacity-20">Continua</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
          <h3 className="text-3xl font-black uppercase tracking-tight">Data e Ora</h3>
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
            {Array.from({ length: 14 }).map((_, i) => {
              const d = addDays(startOfToday(), i);
              const isActive = isSameDay(d, selectedDate);
              return (
                <button 
                  key={i} 
                  onClick={() => setSelectedDate(d)}
                  className={`min-w-[100px] p-6 rounded-3xl border flex flex-col items-center transition-all ${isActive ? 'bg-gold-600 border-gold-600 text-black' : 'bg-zinc-900/50 border-white/5'}`}
                >
                  <span className="text-[10px] font-black uppercase mb-1">{format(d, 'EEE', { locale: it })}</span>
                  <span className="text-2xl font-black">{format(d, 'dd')}</span>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {generateTimeSlots().map(t => (
              <button 
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-4 rounded-2xl border text-sm font-black transition-all ${selectedTime === t ? 'bg-gold-600 border-gold-600 text-black' : 'bg-zinc-900/50 border-white/5 hover:border-white/20'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-4 pt-10">
            <button onClick={() => setStep(2)} className="flex-1 bg-zinc-900 py-6 rounded-full font-black uppercase tracking-widest border border-white/5">Indietro</button>
            <button disabled={!selectedTime} onClick={() => setStep(4)} className="flex-1 bg-white text-black py-6 rounded-full font-black uppercase tracking-widest disabled:opacity-20">Continua</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-10 animate-in slide-in-from-right-10 duration-500">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Nome</label>
              <input required value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 outline-none font-bold focus:border-gold-500 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Cognome</label>
              <input required value={customer.surname} onChange={e => setCustomer({...customer, surname: e.target.value})} className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 outline-none font-bold focus:border-gold-500 transition-colors" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Telefono</label>
              <input required type="tel" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 outline-none font-bold focus:border-gold-500 transition-colors" />
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-4">
            <h4 className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Riepilogo</h4>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-black uppercase tracking-tighter">{format(selectedDate, 'EEEE dd MMMM', { locale: it })}</p>
                <p className="text-4xl font-black text-white mt-1">{selectedTime}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 font-bold">{currentServices.map(s => s.name).join(' + ')}</p>
                <p className="text-2xl font-black text-gold-500 mt-1">€{totalPrice}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => setStep(3)} className="flex-1 bg-zinc-900 py-6 rounded-full font-black uppercase tracking-widest border border-white/5">Indietro</button>
            <button type="submit" className="flex-1 bg-gold-600 hover:bg-gold-500 text-black py-6 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-gold-600/20">Conferma Prenotazione</button>
          </div>
        </form>
      )}
    </div>
  );
};

// --- CLIENT MANAGEMENT VIEW ---
const ManageBooking = ({ bookings, onCancel, onModify, services }: { bookings: Booking[], onCancel: (id: string) => void, onModify: (oldId: string, b: Booking) => void, services: Service[] }) => {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | undefined>(bookings.find(b => b.id === id));
  const [isModifying, setIsModifying] = useState(false);
  const navigate = useNavigate();

  if (!booking) {
    return (
      <div className="pt-40 text-center animate-in fade-in">
        <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h2 className="text-4xl font-black uppercase tracking-tighter">Prenotazione non trovata</h2>
        <p className="text-gray-500 mt-4 mb-10">Il link potrebbe essere scaduto o non corretto.</p>
        <Link to="/" className="inline-block bg-white text-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest">Torna alla Home</Link>
      </div>
    );
  }

  if (isModifying) {
    return <BookingFlow services={services} initialData={booking} onComplete={(newB) => { onModify(booking.id, newB); setIsModifying(false); setBooking(newB); navigate(`/manage-booking/${newB.id}`); }} />;
  }

  return (
    <div className="pt-32 pb-24 px-4 max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black uppercase tracking-tighter">Gestisci <br /><span className="text-gold-500">Prenotazione</span></h2>
        <p className="text-gray-500 mt-4">ID: <span className="font-bold text-white uppercase">{booking.id}</span></p>
      </div>

      <div className="bg-zinc-900 border border-white/10 p-10 rounded-[3rem] space-y-10 shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Appuntamento</p>
            <h4 className="text-2xl font-black uppercase tracking-tighter">{format(parseISO(booking.date), 'EEEE dd MMMM', { locale: it })}</h4>
            <p className="text-4xl font-black mt-2">{booking.time}</p>
          </div>
          <div className="bg-gold-600/10 border border-gold-600/30 px-6 py-4 rounded-3xl text-center">
            <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1">Stato</p>
            <p className="font-black text-white uppercase tracking-widest text-xs">{booking.status}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 space-y-4">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Dettagli Servizi</p>
          <ul className="space-y-2">
            {services.filter(s => booking.serviceIds.includes(s.id)).map(s => (
              <li key={s.id} className="flex justify-between font-bold">
                <span>{s.name}</span>
                <span className="text-gold-500">€{s.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between pt-4 border-t border-white/5">
            <span className="font-black text-gray-400 uppercase tracking-widest text-xs">Totale</span>
            <span className="text-2xl font-black">€{booking.totalPrice}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-10">
          <button onClick={() => setIsModifying(true)} className="bg-white text-black font-black py-5 rounded-full uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105"><Edit2 className="w-4 h-4" /> Modifica</button>
          <button onClick={() => { if(confirm('Sei sicuro di voler cancellare l\'appuntamento?')) { onCancel(booking.id); navigate('/'); }}} className="bg-red-500/10 text-red-500 border border-red-500/20 font-black py-5 rounded-full uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:bg-red-500/20"><Trash2 className="w-4 h-4" /> Disdici</button>
        </div>
      </div>
    </div>
  );
};

// --- SUCCESS VIEW ---
const SuccessView = ({ booking, onReset }: { booking: Booking, onReset: () => void }) => (
  <div className="min-h-screen flex items-center justify-center p-4 pt-32 pb-24 animate-in zoom-in-95 duration-700">
    <div className="max-w-xl w-full text-center space-y-10">
      <div className="w-24 h-24 bg-gold-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-gold-600/40">
        <CheckCircle2 className="text-black w-12 h-12" />
      </div>
      <div>
        <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Prenotazione <br /><span className="text-gold-500">Confermata</span></h2>
        <p className="text-gray-500 font-medium">Grazie {booking.customerName}, la tua richiesta è stata registrata. Ti aspettiamo in salone!</p>
      </div>

      <div className="bg-zinc-900 border border-white/5 p-10 rounded-[3rem] text-left space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Quando</p>
            <h4 className="text-2xl font-black uppercase tracking-tighter">{format(parseISO(booking.date), 'EEEE dd MMMM', { locale: it })}</h4>
            <p className="text-4xl font-black mt-2">{booking.time}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Prezzo</p>
            <h4 className="text-4xl font-black text-gold-500">€{booking.totalPrice}</h4>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 space-y-2">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Link di Gestione</p>
           <div className="bg-black p-4 rounded-xl border border-white/5 font-mono text-xs break-all text-gold-500/80">
              {window.location.origin}/manage-booking/{booking.id}
           </div>
           <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-2">Salva questo link per modificare o disdire in autonomia.</p>
        </div>
      </div>

      <button onClick={onReset} className="inline-block bg-white text-black px-14 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Torna alla Home</button>
    </div>
  </div>
);

// --- ADMIN CALENDAR ---
const AdminCalendar = ({ bookings, onStatusChange }: { bookings: Booking[], onStatusChange: (id: string, s: BookingStatus) => void }) => {
  const [viewDate, setViewDate] = useState<Date>(startOfToday());
  const dayBookings = bookings.filter(b => b.date === format(viewDate, 'yyyy-MM-dd')).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter">Calendario</h1>
          <p className="text-gray-500 font-medium">Gestione appuntamenti giornaliera.</p>
        </div>
        
        <div className="flex items-center bg-zinc-900 p-2 rounded-full border border-white/5">
          <button onClick={() => setViewDate(addDays(viewDate, -1))} className="p-4 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft /></button>
          <div className="px-10 text-center min-w-[200px]">
            <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1">{format(viewDate, 'EEEE', { locale: it })}</p>
            <p className="text-xl font-serif font-bold">{format(viewDate, 'dd MMMM yyyy', { locale: it })}</p>
          </div>
          <button onClick={() => setViewDate(addDays(viewDate, 1))} className="p-4 hover:bg-white/5 rounded-full transition-colors"><ChevronRight /></button>
        </div>
      </div>

      <div className="space-y-4">
        {dayBookings.length > 0 ? dayBookings.map(b => (
          <div key={b.id} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-zinc-900 transition-all group">
            <div className="flex items-center gap-8">
              <div className="text-center min-w-[100px] py-4 px-6 bg-black rounded-3xl border border-white/5 group-hover:border-gold-500/50 transition-colors">
                <p className="text-4xl font-black">{b.time}</p>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{b.totalDuration} min</p>
              </div>
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tighter">{b.customerName} {b.customerSurname}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold-500">{INITIAL_TEAM.find(t => t.id === b.barberId)?.name}</span>
                  <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                  <span className="text-[10px] font-bold text-gray-500">{b.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select 
                value={b.status} 
                onChange={(e) => onStatusChange(b.id, e.target.value as BookingStatus)}
                className={`px-6 py-4 rounded-2xl bg-black border border-white/10 font-black text-xs uppercase tracking-widest outline-none transition-all ${
                  b.status === BookingStatus.CONFIRMED ? 'text-green-500 border-green-500/30' : 
                  b.status === BookingStatus.CANCELLED ? 'text-red-500 border-red-500/30' : 'text-gold-500 border-gold-500/30'
                }`}
              >
                {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )) : (
          <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <Calendar className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-zinc-600 uppercase tracking-tighter">Nessun impegno in agenda</h3>
            <p className="text-zinc-700 font-bold mt-2">I clienti possono prenotare slot da 30 minuti.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ADMIN SETTINGS ---
const AdminSettings = ({ webhookUrl, setWebhookUrl }: { webhookUrl: string, setWebhookUrl: (u: string) => void }) => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleTestWebhook = async () => {
    setTestStatus('testing');
    const success = await sendWebhook(webhookUrl, {
      event: 'test_connection',
      timestamp: new Date().toISOString(),
      cliente: { nome: 'Admin', cognome: 'Test', telefono: '0000000000' }
    });
    setTestStatus(success ? 'success' : 'error');
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">Impostazioni</h1>
        <p className="text-gray-500 font-medium">Configura il tuo salone e le automazioni.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[2.5rem] space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <Globe className="text-blue-500 w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Integrazione n8n</h3>
          </div>
          <p className="text-gray-500 font-medium">Inserisci l'URL del tuo workflow n8n per ricevere notifiche su prenotazioni, disdette e modifiche.</p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Webhook URL</label>
              <input 
                type="url" 
                placeholder="https://YOUR-N8N-URL/webhook/albibarber"
                value={webhookUrl} 
                onChange={e => setWebhookUrl(e.target.value)} 
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 focus:border-gold-500 outline-none text-lg font-bold font-mono text-sm" 
              />
            </div>
            
            <div className="flex items-center justify-between pt-4">
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${webhookUrl ? 'bg-green-500 animate-pulse' : 'bg-zinc-800'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{webhookUrl ? 'Configurato' : 'Non collegato'}</span>
               </div>
               <button 
                onClick={handleTestWebhook}
                disabled={!webhookUrl || testStatus === 'testing'}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all disabled:opacity-20"
               >
                 {testStatus === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                 {testStatus === 'success' ? 'Inviato!' : testStatus === 'error' ? 'Errore!' : 'Test Connessione'}
               </button>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[2.5rem] flex items-center justify-center border-dashed">
            <div className="text-center opacity-20">
              <Settings className="w-16 h-16 mx-auto mb-6" />
              <p className="text-[10px] font-black uppercase tracking-widest">Altre impostazioni coming soon</p>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- APP CONTENT WRAPPER ---
const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('albibarber_bookings');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('albibarber_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('albibarber_webhook_url') || '';
  });

  const [team, setTeam] = useState<Barber[]>(INITIAL_TEAM);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => localStorage.getItem('albibarber_auth') === 'true');
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);

  useEffect(() => localStorage.setItem('albibarber_bookings', JSON.stringify(bookings)), [bookings]);
  useEffect(() => localStorage.setItem('albibarber_services', JSON.stringify(services)), [services]);
  useEffect(() => localStorage.setItem('albibarber_auth', isLoggedIn.toString()), [isLoggedIn]);
  useEffect(() => localStorage.setItem('albibarber_webhook_url', webhookUrl), [webhookUrl]);

  const triggerWebhook = async (event: 'new_booking' | 'booking_cancelled' | 'booking_modified', booking: Booking) => {
    const barber = INITIAL_TEAM.find(t => t.id === booking.barberId);
    const bookedServices = services.filter(s => booking.serviceIds.includes(s.id));
    
    const payload: WebhookPayload = {
      event,
      booking_id: booking.id,
      timestamp: new Date().toISOString(),
      cliente: {
        nome: booking.customerName,
        cognome: booking.customerSurname,
        telefono: booking.phone,
        email: booking.email,
      },
      appuntamento: {
        data: booking.date,
        ora: booking.time,
        barbiere: barber?.name || 'Sconosciuto',
        servizi: bookedServices.map(s => s.name),
        durata_totale: booking.totalDuration,
        prezzo_totale: booking.totalPrice,
      },
      link_gestione: `${window.location.origin}/manage-booking/${booking.id}`
    };
    
    await sendWebhook(webhookUrl, payload);
  };

  const handleBookingComplete = (booking: Booking) => {
    setBookings([booking, ...bookings]);
    setLastBooking(booking);
    triggerWebhook('new_booking', booking);
  };

  const handleCancelBooking = (id: string) => {
    const b = bookings.find(item => item.id === id);
    if (b) {
      const updated = bookings.map(item => item.id === id ? { ...item, status: BookingStatus.CANCELLED } : item);
      setBookings(updated);
      triggerWebhook('booking_cancelled', { ...b, status: BookingStatus.CANCELLED });
    }
  };

  const handleModifyBooking = (oldId: string, newB: Booking) => {
    const updated = bookings.map(item => item.id === oldId ? { ...newB, id: oldId } : item);
    setBookings(updated);
    triggerWebhook('booking_modified', newB);
  };

  const handleStatusChange = (id: string, status: BookingStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold-500 selection:text-black">
      {!isAdminPath && location.pathname !== '/login' && <Navbar />}
      
      <Routes>
        <Route path="/" element={<HomeView />} />
        
        <Route path="/booking" element={
          lastBooking ? (
            <SuccessView booking={lastBooking} onReset={() => setLastBooking(null)} />
          ) : (
            <BookingFlow services={services} onComplete={handleBookingComplete} />
          )
        } />

        <Route path="/manage-booking/:id" element={<ManageBooking bookings={bookings} services={services} onCancel={handleCancelBooking} onModify={handleModifyBooking} />} />

        <Route path="/portfolio" element={
          <div className="pt-32 px-4 pb-24 max-w-7xl mx-auto">
            <h1 className="text-7xl md:text-8xl font-black mb-16 text-center font-serif tracking-tighter leading-none uppercase italic">L'Arte del <span className="text-gold-500">Taglio</span></h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="group overflow-hidden rounded-[3rem] relative aspect-square bg-zinc-900 border border-white/5 transition-all hover:scale-[1.02] shadow-2xl">
                  <img src={`https://picsum.photos/seed/hair${i+10}/800`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Work style" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-10">
                    <div>
                      <p className="text-gold-500 font-black text-[10px] uppercase tracking-widest mb-3">Professional Style</p>
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Signature Master {i+1}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        } />

        <Route path="/login" element={isLoggedIn ? <Navigate to="/admin" replace /> : <LoginView onLogin={() => setIsLoggedIn(true)} />} />

        <Route path="/admin/*" element={
          isLoggedIn ? (
            <div className="flex min-h-screen animate-in fade-in duration-500">
              <AdminSidebar onLogout={handleLogout} />
              <main className="flex-1 bg-black p-6 md:p-14 overflow-y-auto pt-24 lg:pt-14 relative">
                <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
                  <span className="font-serif font-black text-white uppercase tracking-tighter">Admin</span>
                  <button onClick={handleLogout} className="bg-red-500/10 text-red-500 p-2.5 rounded-full"><LogOut className="w-5 h-5" /></button>
                </div>

                <Routes>
                  <Route index element={<AdminDashboard bookings={bookings} services={services} />} />
                  <Route path="calendar" element={<AdminCalendar bookings={bookings} onStatusChange={handleStatusChange} />} />
                  <Route path="services" element={<AdminServices services={services} setServices={setServices} />} />
                  <Route path="team" element={<AdminTeam team={team} setTeam={setTeam} />} />
                  <Route path="settings" element={<AdminSettings webhookUrl={webhookUrl} setWebhookUrl={setWebhookUrl} />} />
                </Routes>
              </main>
            </div>
          ) : <Navigate to="/login" replace />
        } />
      </Routes>
      {!isAdminPath && location.pathname !== '/login' && <Footer />}
    </div>
  );
};

// --- ADMIN COMPONENTS ---
const AdminDashboard = ({ bookings, services }: { bookings: Booking[], services: Service[] }) => {
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayBookings = bookings.filter(b => b.date === today && b.status !== BookingStatus.CANCELLED);
  const totalRevenue = bookings.filter(b => b.status === BookingStatus.COMPLETED).reduce((acc, b) => acc + b.totalPrice, 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase">Dashboard</h1>
          <p className="text-gray-500 font-medium">Performance del salone in tempo reale.</p>
        </div>
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-5 flex items-center gap-4">
          <Calendar className="text-gold-500 w-6 h-6" />
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Data</p>
            <p className="text-lg font-serif font-bold">{format(new Date(), 'EEEE dd MMMM', { locale: it })}</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Agenda Oggi', val: todayBookings.length, icon: Calendar, color: 'text-gold-500', bg: 'bg-gold-500/10' },
          { label: 'Incasso Totale', val: `€${totalRevenue}`, icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Clienti', val: bookings.length, icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Trend', val: '+12%', icon: Activity, color: 'text-red-500', bg: 'bg-red-500/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem] group hover:border-gold-500/30 transition-all">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`${stat.color} w-6 h-6`} />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-4xl font-black">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black tracking-tight uppercase">Agenda Oggi</h3>
            <button onClick={() => navigate('/admin/calendar')} className="text-gold-500 font-black text-[10px] uppercase tracking-widest hover:underline">Vedi tutto</button>
          </div>
          <div className="space-y-4">
            {todayBookings.length > 0 ? todayBookings.map(b => (
              <div key={b.id} className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-gold-600 text-black rounded-full flex items-center justify-center font-black text-xl">{b.customerName[0]}</div>
                  <div>
                    <h5 className="font-black text-xl uppercase tracking-tighter">{b.customerName} {b.customerSurname}</h5>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                      {services.filter(s => b.serviceIds.includes(s.id)).map(s => s.name).join(' + ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black">{b.time}</p>
                </div>
              </div>
            )) : <div className="py-24 text-center bg-zinc-900/20 rounded-3xl border border-dashed border-white/5 text-gray-600 uppercase text-xs font-black">Nessun appuntamento</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Re-using the logic for AdminServices/AdminTeam as previously defined
const AdminServices = ({ services, setServices }: { services: Service[], setServices: React.Dispatch<React.SetStateAction<Service[]>> }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Service>>({});

  const handleSave = () => {
    if (editingId) {
      setServices(services.map(s => s.id === editingId ? { ...s, ...editForm } as Service : s));
      setEditingId(null);
    } else {
      const newService = { ...editForm, id: Date.now().toString() } as Service;
      setServices([...services, newService]);
      setIsAdding(false);
    }
    setEditForm({});
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter">Servizi</h1>
          <p className="text-gray-500 font-medium">Gestisci il listino prezzi e i trattamenti offerti.</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditForm({ category: 'Classic', duration: 30, price: 15 }); }}
          className="bg-gold-600 text-black font-black py-4 px-8 rounded-full flex items-center gap-2 hover:bg-gold-500 transition-all shadow-xl shadow-gold-600/20"
        >
          <Plus className="w-5 h-5" /> NUOVO SERVIZIO
        </button>
      </div>

      <div className="grid gap-4">
        {(isAdding || editingId) && (
          <div className="bg-zinc-900 border-2 border-gold-500 p-8 rounded-[2.5rem] grid md:grid-cols-4 gap-6 animate-in slide-in-from-top-4">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Nome Servizio</label>
              <input value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Prezzo (€)</label>
              <input type="number" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Durata (min)</label>
              <input type="number" value={editForm.duration || ''} onChange={e => setEditForm({...editForm, duration: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none font-bold" />
            </div>
            <div className="flex gap-4 col-span-4 justify-end pt-4">
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-8 py-4 text-gray-500 font-black uppercase tracking-widest text-xs">Annulla</button>
              <button onClick={handleSave} className="bg-white text-black font-black py-4 px-10 rounded-full flex items-center gap-2 shadow-xl"><Save className="w-4 h-4" /> SALVA</button>
            </div>
          </div>
        )}

        {services.map(s => (
          <div key={s.id} className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:bg-zinc-900 transition-all">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-1">
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${s.category === 'Premium' ? 'bg-gold-600 text-black' : 'bg-zinc-800 text-gray-400'}`}>{s.category}</span>
                <h4 className="text-xl font-black uppercase tracking-tighter">{s.name}</h4>
              </div>
              <div className="text-gray-500 text-sm font-bold flex items-center gap-4">
                <span>€{s.price.toFixed(2)}</span>
                <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                <span>{s.duration} minuti</span>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditingId(s.id); setEditForm(s); }} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all"><Edit2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminTeam = ({ team, setTeam }: { team: Barber[], setTeam: React.Dispatch<React.SetStateAction<Barber[]>> }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">Team</h1>
        <p className="text-gray-500 font-medium">Visualizza e gestisci i tuoi professionisti.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map(b => (
          <div key={b.id} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] relative group text-center">
            <div className="relative mb-6 mx-auto w-32 h-32">
              <img src={b.imageUrl} className="w-full h-full rounded-full object-cover grayscale border-4 border-zinc-800" alt={b.name} />
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-zinc-900" style={{ backgroundColor: b.color }}></div>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">{b.name}</h3>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-6">{b.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Final LoginView placeholder
const LoginView = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@albibarber.com' && password === 'admin123') {
      onLogin();
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-10">Staff Login</h2>
        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-10 space-y-6">
          <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 focus:border-gold-500 outline-none font-bold" />
          <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 focus:border-gold-500 outline-none font-bold" />
          <button type="submit" className="w-full bg-gold-600 text-black font-black py-6 rounded-full uppercase tracking-widest text-sm">Accedi</button>
        </form>
      </div>
    </div>
  );
};

function App() { return <Router><AppContent /></Router>; }
export default App;
