
import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
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
  ImageIcon,
  LogOut,
  Lock,
  User,
  Activity
} from 'lucide-react';
import { SERVICES as INITIAL_SERVICES, TEAM, OPENING_HOURS } from './constants';
import { Booking, BookingStatus, Service, Barber } from './types';
import { format, addDays, isSameDay, parseISO, startOfToday } from 'date-fns';
import { it } from 'date-fns/locale';

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
            <span className="font-serif text-2xl font-black tracking-tighter text-white">
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

      {/* Mobile Menu */}
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
        <div className="flex gap-4">
          {['IG', 'FB', 'TT'].map(social => (
            <div key={social} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-gold-500 hover:bg-gold-600/10 transition-all cursor-pointer border border-white/5 font-bold">
              {social}
            </div>
          ))}
        </div>
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
          <li className="hover:text-white cursor-pointer transition-colors">Politica di Cancellazione</li>
          <li><Link to="/login" className="hover:text-white transition-colors">Area Riservata Staff</Link></li>
          <li className="hover:text-white cursor-pointer transition-colors">Contattaci</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 text-center text-gray-600 text-sm">
      &copy; 2026 AlbiBarber System. Crafted with passion by PatrickAi Automation.
    </div>
  </footer>
);

// --- AUTH VIEW ---

const LoginView = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@albibarber.com' && password === 'admin123') {
      onLogin();
      navigate('/admin');
    } else {
      setError('Credenziali non valide. Riprova.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-gold-600 rounded-full flex items-center justify-center">
              <Scissors className="text-black w-7 h-7" />
            </div>
            <span className="font-serif text-3xl font-black tracking-tighter text-white uppercase">
              ALBI<span className="text-gold-500">BARBER</span>
            </span>
          </Link>
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">Login <br /><span className="text-gold-500">Staff Admin</span></h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Accesso protetto al sistema gestionale</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-10 space-y-6 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center animate-shake">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Indirizzo Email</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-16 pr-6 py-5 focus:border-gold-500 outline-none transition-all text-lg font-bold"
                placeholder="admin@albibarber.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Password</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-16 pr-6 py-5 focus:border-gold-500 outline-none transition-all text-lg font-bold"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-gold-600 hover:bg-gold-500 text-black font-black py-6 rounded-full transition-all hover:scale-[1.02] shadow-2xl shadow-gold-600/20 uppercase tracking-[0.2em] text-sm"
          >
            Accedi Ora
          </button>
          <div className="text-center pt-4">
            <Link to="/" className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              <ChevronLeft className="w-3 h-3" /> Torna al sito pubblico
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- CLIENT PAGES ---

const HomeView = () => (
  <div className="flex flex-col">
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover opacity-40 grayscale"
          alt="Barbershop Atmosphere"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black to-black"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl px-4 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-gold-600/10 border border-gold-500/20 text-gold-500 text-xs font-bold uppercase tracking-[0.3em] mb-8 animate-pulse">
          Premium Grooming Experience
        </div>
        <h1 className="font-serif text-6xl md:text-9xl font-black mb-8 leading-[0.9] tracking-tighter">
          IL TUO STILE, <br />
          <span className="text-gold-500 italic">UN CLICK</span> <br /> 
          DI DISTANZA.
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Niente attese, niente telefonate. Prenota il tuo look perfetto in meno di 30 secondi.
        </p>
        <Link 
          to="/booking" 
          className="group inline-flex items-center gap-4 bg-gold-600 hover:bg-gold-500 text-black font-black py-6 px-14 rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-gold-600/40"
        >
          PRENOTA IL TUO POSTO <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </section>

    <section className="py-24 px-4 bg-zinc-950">
       <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="p-10 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-gold-500/30 transition-all group">
          <Clock className="w-12 h-12 text-gold-500 mb-8 group-hover:scale-110 transition-transform" />
          <h4 className="text-3xl font-bold mb-6">Orari</h4>
          <div className="space-y-3 text-gray-400">
            {Object.entries(OPENING_HOURS).map(([day, hours]) => (
              <div key={day} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                <span className="font-medium text-white/60">{day}</span>
                <span>{hours.morning.open === 'CHIUSO' ? 'Chiuso' : `${hours.morning.open}-${hours.afternoon.close}`}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-10 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-gold-500/30 transition-all group">
          <MapPin className="w-12 h-12 text-gold-500 mb-8 group-hover:scale-110 transition-transform" />
          <h4 className="text-3xl font-bold mb-6">Location</h4>
          <p className="text-gray-400 text-lg mb-8">Via del Risorgimento 42,<br />20100 Milano (MI)</p>
          <button className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-2xl w-full transition-all border border-white/10 flex items-center justify-center gap-3">
            Apri Mappe <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="p-10 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-gold-500/30 transition-all group">
          <Phone className="w-12 h-12 text-gold-500 mb-8 group-hover:scale-110 transition-transform" />
          <h4 className="text-3xl font-bold mb-6">Contatti</h4>
          <p className="text-gray-400 text-lg mb-8">Hai richieste speciali? Chiamaci subito!</p>
          <a href="tel:+39021234567" className="text-3xl font-black text-white hover:text-gold-500 transition-colors tracking-tight">+39 02 1234567</a>
        </div>
      </div>
    </section>
  </div>
);

// --- BOOKING FLOW ---

const BookingFlow = ({ services, onComplete }: { services: Service[], onComplete: (b: Booking) => void }) => {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', surname: '', phone: '', email: '', notes: '' });

  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

  const toggleService = (s: Service) => {
    if (selectedServices.find(item => item.id === s.id)) {
      setSelectedServices(selectedServices.filter(item => item.id !== s.id));
    } else {
      setSelectedServices([...selectedServices, s]);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const generateSlots = () => {
    if (!selectedDate) return [];
    const dayName = format(selectedDate, 'EEEE', { locale: it });
    const hours = OPENING_HOURS[dayName] || OPENING_HOURS['Lunedì'];
    if (hours.morning.open === 'CHIUSO') return [];
    const slots: string[] = [];
    const pushSlots = (start: string, end: string) => {
      let current = start;
      while (current < end) {
        slots.push(current);
        const [h, m] = current.split(':').map(Number);
        const next = new Date(0, 0, 0, h, m + 20);
        current = format(next, 'HH:mm');
      }
    };
    pushSlots(hours.morning.open, hours.morning.close);
    pushSlots(hours.afternoon.open, hours.afternoon.close);
    return slots;
  };

  const handleConfirm = () => {
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      customerName: formData.name,
      customerSurname: formData.surname,
      phone: formData.phone,
      email: formData.email,
      notes: formData.notes,
      barberId: selectedBarberId || 'none',
      serviceIds: selectedServices.map(s => s.id),
      date: format(selectedDate!, 'yyyy-MM-dd'),
      time: selectedTime!,
      totalPrice,
      totalDuration,
      status: BookingStatus.CONFIRMED,
      createdAt: new Date().toISOString()
    };
    onComplete(newBooking);
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10 overflow-hidden rounded-full bg-zinc-900 border border-white/5 p-1.5 w-fit mx-auto">
          {[1,2,3,4,5].map(i => (
            <div 
              key={i} 
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
                step === i ? 'bg-gold-600 text-black scale-110 shadow-lg shadow-gold-600/30' : 
                step > i ? 'bg-zinc-700 text-gray-400' : 'bg-transparent text-gray-500'
              }`}
            >
              {i}
            </div>
          ))}
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-8 md:p-14 backdrop-blur-xl shadow-2xl">
          {step === 1 && (
            <div className="space-y-10">
              <div className="text-center">
                <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">Servizi</h2>
                <p className="text-gray-400 text-lg">Seleziona i trattamenti desiderati</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map(s => {
                  const isSelected = selectedServices.some(item => item.id === s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleService(s)}
                      className={`flex items-center justify-between p-7 rounded-3xl border transition-all text-left group ${
                        isSelected 
                          ? 'bg-gold-600 border-gold-500 text-black' 
                          : 'bg-zinc-950 border-white/5 hover:border-gold-500/30'
                      }`}
                    >
                      <div className="flex-1">
                        <h4 className="font-black text-xl mb-2 uppercase tracking-tighter">{s.name}</h4>
                        <div className={`flex items-center gap-4 text-sm font-bold ${isSelected ? 'text-black/60' : 'text-gray-500'}`}>
                          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {s.duration} min</span>
                          <span>€{s.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-black border-black scale-110' : 'border-white/10 group-hover:border-gold-500'}`}>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-gold-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Prezzo Stimato</p>
                  <p className="text-4xl font-black text-white">€{totalPrice.toFixed(2)} <span className="text-lg text-gray-500 font-medium italic">/ {totalDuration} min</span></p>
                </div>
                <button 
                  disabled={selectedServices.length === 0}
                  onClick={nextStep}
                  className="w-full sm:w-auto bg-white text-black font-black py-5 px-16 rounded-full transition-all hover:scale-105 hover:bg-gold-500 disabled:opacity-20 shadow-xl"
                >
                  PROSEGUI
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center">
                <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">Professionista</h2>
                <p className="text-gray-400 text-lg">Scegli chi si prenderà cura di te</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <button
                  onClick={() => { setSelectedBarberId('none'); nextStep(); }}
                  className={`group p-8 rounded-[2.5rem] border flex flex-col items-center gap-6 transition-all ${
                    selectedBarberId === 'none' ? 'bg-gold-600 border-gold-500 text-black' : 'bg-zinc-950 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${selectedBarberId === 'none' ? 'bg-black' : 'bg-zinc-800 group-hover:bg-zinc-700'}`}>
                    <Users className={`w-12 h-12 ${selectedBarberId === 'none' ? 'text-gold-500' : 'text-gray-500'}`} />
                  </div>
                  <span className="font-black text-center text-lg leading-tight uppercase tracking-tighter">Chiunque</span>
                </button>
                {TEAM.map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setSelectedBarberId(b.id); nextStep(); }}
                    className={`group p-8 rounded-[2.5rem] border flex flex-col items-center gap-6 transition-all ${
                      selectedBarberId === b.id ? 'bg-gold-600 border-gold-500 text-black' : 'bg-zinc-950 border-white/5 hover:border-gold-500/40'
                    }`}
                  >
                    <div className="relative">
                      <img src={b.imageUrl} className="w-24 h-24 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all border-4 border-transparent group-hover:border-gold-500/20" alt={b.name} />
                      {selectedBarberId === b.id && <div className="absolute -bottom-2 -right-2 bg-black text-gold-500 rounded-full p-1"><CheckCircle2 className="w-6 h-6" /></div>}
                    </div>
                    <div className="text-center">
                      <h4 className="font-black text-xl uppercase tracking-tighter">{b.name}</h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${selectedBarberId === b.id ? 'text-black/60' : 'text-gray-500'}`}>Stylist</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={prevStep} className="mx-auto flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-black uppercase text-xs tracking-widest">
                <ChevronLeft className="w-5 h-5" /> Torna indietro
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center">
                <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">Data & Ora</h2>
                <p className="text-gray-400 text-lg">Quando vorresti venire in salone?</p>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar px-2">
                {Array.from({ length: 14 }).map((_, i) => {
                  const d = addDays(startOfToday(), i);
                  const isSun = d.getDay() === 0;
                  const active = selectedDate && isSameDay(d, selectedDate);
                  return (
                    <button
                      key={i}
                      disabled={isSun}
                      onClick={() => setSelectedDate(d)}
                      className={`min-w-[100px] p-6 rounded-[2rem] border flex flex-col items-center transition-all ${
                        active ? 'bg-gold-600 border-gold-500 text-black scale-110 shadow-xl shadow-gold-600/30' : 
                        isSun ? 'opacity-10 cursor-not-allowed border-transparent' : 'bg-zinc-950 border-white/5 hover:border-white/20 text-gray-400'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-black tracking-widest mb-2">{format(d, 'EEE', { locale: it })}</span>
                      <span className="text-3xl font-black">{format(d, 'dd')}</span>
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3 animate-in fade-in zoom-in-95 duration-300">
                  {generateSlots().map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-4 rounded-2xl border text-sm font-black transition-all ${
                        selectedTime === slot 
                          ? 'bg-white text-black border-white shadow-lg' 
                          : 'bg-zinc-950 border-white/5 hover:border-gold-500/40 text-gray-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-10 border-t border-white/5">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-black uppercase text-xs tracking-widest">
                  <ChevronLeft className="w-5 h-5" /> Indietro
                </button>
                <button 
                  disabled={!selectedDate || !selectedTime}
                  onClick={nextStep}
                  className="bg-gold-600 hover:bg-gold-500 disabled:opacity-20 text-black font-black py-5 px-14 rounded-full transition-all hover:scale-105 shadow-xl"
                >
                  CONFERMA ORA
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center">
                <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">I Tuoi Dati</h2>
                <p className="text-gray-400 text-lg">Quasi finito! Inserisci i tuoi riferimenti</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Nome *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold-500 outline-none transition-all text-lg font-bold"
                    placeholder="Esempio: Marco"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Cognome *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.surname}
                    onChange={e => setFormData({...formData, surname: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold-500 outline-none transition-all text-lg font-bold"
                    placeholder="Esempio: Rossi"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Cellulare *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold-500 outline-none transition-all text-lg font-bold"
                    placeholder="+39 3XX XXXXXXX"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Email</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold-500 outline-none transition-all text-lg font-bold"
                    placeholder="marco@example.it"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-10 border-t border-white/5">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-black uppercase text-xs tracking-widest">
                  <ChevronLeft className="w-5 h-5" /> Indietro
                </button>
                <button 
                  disabled={!formData.name || !formData.surname || !formData.phone}
                  onClick={nextStep}
                  className="bg-gold-600 hover:bg-gold-500 disabled:opacity-20 text-black font-black py-5 px-14 rounded-full transition-all hover:scale-105 shadow-xl"
                >
                  VEDI RIEPILOGO
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center">
                <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">Riepilogo</h2>
                <p className="text-gray-400 text-lg">Conferma i dettagli del tuo appuntamento</p>
              </div>
              <div className="bg-black/60 border border-gold-500/20 rounded-[2.5rem] p-10 space-y-6 shadow-2xl">
                 <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Staff</span>
                  <span className="font-black text-xl text-gold-500">{TEAM.find(b => b.id === selectedBarberId)?.name || 'Qualunque'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Data & Ora</span>
                  <div className="text-right">
                    <span className="font-black text-xl block">{format(selectedDate!, 'dd MMMM yyyy', { locale: it })}</span>
                    <span className="font-black text-lg text-gold-500">alle ore {selectedTime}</span>
                  </div>
                </div>
                <div className="space-y-3">
                   <span className="text-gray-500 font-black uppercase tracking-widest text-[10px] block">Servizi Scelti</span>
                   {selectedServices.map(s => (
                    <div key={s.id} className="flex justify-between font-bold">
                      <span className="text-gray-300">{s.name}</span>
                      <span className="text-white">€{s.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t border-gold-500/40 flex justify-between items-end">
                  <span className="text-2xl font-black uppercase tracking-tighter">TOTALE SERVIZI</span>
                  <span className="text-5xl font-black text-gold-500">€{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-black uppercase text-xs tracking-widest">
                  <ChevronLeft className="w-5 h-5" /> Modifica
                </button>
                <button 
                  onClick={handleConfirm}
                  className="bg-gold-600 hover:bg-gold-500 text-black font-black py-6 px-16 rounded-full transition-all hover:scale-110 shadow-2xl shadow-gold-600/40"
                >
                  PRENOTA ORA
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SuccessView = ({ booking, onReset }: { booking: Booking, onReset: () => void }) => (
  <div className="min-h-screen bg-black flex items-center justify-center p-4">
    <div className="max-w-md w-full text-center space-y-10 animate-in fade-in zoom-in duration-700">
      <div className="w-28 h-28 bg-gold-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-gold-600/60 animate-bounce">
        <CheckCircle2 className="w-14 h-14 text-black" />
      </div>
      <div className="space-y-4">
        <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Appuntamento <br /> <span className="text-gold-500">Confermato!</span></h2>
        <p className="text-gray-400 text-xl leading-relaxed">
          Ti aspettiamo il <strong className="text-white">{format(parseISO(booking.date), 'dd/MM')}</strong> alle <strong className="text-white">{booking.time}</strong>.
        </p>
      </div>
      <div className="bg-zinc-900 border border-white/5 rounded-[2rem] p-8 text-left space-y-4 shadow-2xl">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Booking ID</span>
          <span className="text-gold-500 font-mono font-black text-lg">#{booking.id}</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed font-bold uppercase tracking-wider">
          Riceverai un promemoria 24h prima. Per modifiche o disdette usa il link nella mail di conferma.
        </p>
      </div>
      <div className="space-y-4">
        <button 
          onClick={onReset}
          className="w-full bg-white text-black font-black py-5 rounded-full hover:bg-gold-500 transition-all hover:scale-105 shadow-xl uppercase tracking-widest text-sm"
        >
          Nuova Prenotazione
        </button>
        <Link 
          to="/" 
          onClick={onReset}
          className="block w-full text-gray-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors"
        >
          Torna alla Home
        </Link>
      </div>
    </div>
  </div>
);

// --- ADMIN PAGES ---

/**
 * Updated AdminDashboard to accept services state as a prop to correctly
 * display service names and fix the "Cannot find name 'SERVICES'" error.
 */
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
          <p className="text-gray-500 font-medium">Statistiche e performance del salone in tempo reale.</p>
        </div>
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-5 flex items-center gap-4 shadow-xl">
          <Calendar className="text-gold-500 w-6 h-6" />
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Data Odierna</p>
            <p className="text-lg font-serif font-bold">{format(new Date(), 'EEEE dd MMMM', { locale: it })}</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Agenda Oggi', val: todayBookings.length, icon: Calendar, color: 'text-gold-500', bg: 'bg-gold-500/10' },
          { label: 'Incasso Mensile', val: `€${totalRevenue}`, icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Fiducia Clienti', val: '98%', icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Trend Salone', val: '+12%', icon: Activity, color: 'text-red-500', bg: 'bg-red-500/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem] hover:border-white/10 transition-all group">
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
            <h3 className="text-3xl font-black tracking-tight uppercase">Oggi in Agenda</h3>
            <button 
              onClick={() => navigate('/admin/calendar')}
              className="text-gold-500 font-black text-[10px] uppercase tracking-widest hover:underline"
            >
              Apri Agenda Completa
            </button>
          </div>
          <div className="space-y-4">
            {todayBookings.length > 0 ? todayBookings.slice(0, 5).map(b => (
              <div key={b.id} className="bg-zinc-900 border border-white/5 p-6 rounded-3xl flex items-center justify-between hover:bg-zinc-800 transition-colors shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-gold-600 text-black rounded-full flex items-center justify-center font-black text-xl shadow-lg">
                    {b.customerName[0].toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-black text-xl uppercase tracking-tighter">{b.customerName} {b.customerSurname}</h5>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                      {/* Fixed: Use services prop instead of missing SERVICES constant */}
                      {services.filter(s => b.serviceIds.includes(s.id)).map(s => s.name).join(' + ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-white">{b.time}</p>
                  <p className="text-[10px] text-gold-500 font-black uppercase tracking-widest">{TEAM.find(barber => barber.id === b.barberId)?.name || 'Nessuno'}</p>
                </div>
              </div>
            )) : (
              <div className="py-24 text-center bg-zinc-900/50 rounded-3xl border border-dashed border-white/10">
                <p className="text-gray-500 italic font-black uppercase tracking-widest text-xs">Nessun appuntamento per oggi</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-3xl font-black tracking-tight uppercase">Log Attività</h3>
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-6 border-l-2 border-gold-600/30 pl-6 relative py-2">
                <div className="absolute -left-1.5 top-0 w-3 h-3 bg-gold-600 rounded-full shadow-[0_0_10px_rgba(213,150,59,0.5)]"></div>
                <div>
                  <p className="font-black text-lg text-white uppercase tracking-tighter">Prenotazione Web</p>
                  <p className="text-[10px] text-gray-500 font-black mb-3 uppercase">Pochi istanti fa</p>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">Un nuovo cliente ha richiesto un servizio Premium per sabato pomeriggio.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminCalendar = ({ bookings, onStatusChange }: { bookings: Booking[], onStatusChange: (id: string, s: BookingStatus) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const filteredBookings = bookings.filter(b => b.date === format(currentDate, 'yyyy-MM-dd'));

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <h1 className="text-5xl font-black uppercase tracking-tighter">Agenda Barber</h1>
        <div className="flex items-center gap-4 bg-zinc-900 rounded-[2.5rem] p-2 border border-white/5 shadow-2xl">
          <button 
            onClick={() => setCurrentDate(addDays(currentDate, -1))}
            className="p-4 hover:bg-white/5 rounded-2xl text-gray-400 hover:text-gold-500 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="font-black px-6 text-xl min-w-[240px] text-center uppercase tracking-tighter border-x border-white/5">
            {format(currentDate, 'EEEE dd MMMM', { locale: it })}
          </span>
          <button 
            onClick={() => setCurrentDate(addDays(currentDate, 1))}
            className="p-4 hover:bg-white/5 rounded-2xl text-gray-400 hover:text-gold-500 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {TEAM.map(barber => (
          <div key={barber.id} className="space-y-6">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ backgroundColor: barber.color }}></div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">{barber.name}</h3>
            </div>
            
            <div className="space-y-4">
              {filteredBookings.filter(b => b.barberId === barber.id || b.barberId === 'none').map(b => (
                <div key={b.id} className={`bg-zinc-900 border-l-4 p-6 rounded-[2rem] group relative transition-all hover:scale-[1.02] shadow-sm ${b.status === BookingStatus.CANCELLED ? 'opacity-30 grayscale' : ''}`} style={{ borderLeftColor: barber.color }}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl font-black tracking-tighter leading-none">{b.time}</span>
                    <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-[0.1em] ${
                      b.status === BookingStatus.COMPLETED ? 'bg-green-500 text-black' : 
                      b.status === BookingStatus.CANCELLED ? 'bg-red-500 text-white' : 'bg-gold-500 text-black'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <h4 className="font-black text-xl mb-1 uppercase tracking-tighter truncate">{b.customerName} {b.customerSurname}</h4>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-6">{b.phone}</p>
                  
                  {b.status !== BookingStatus.CANCELLED && b.status !== BookingStatus.COMPLETED && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onStatusChange(b.id, BookingStatus.COMPLETED)}
                        className="flex-1 text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 py-3 rounded-xl hover:bg-green-500 hover:text-black transition-all"
                      >
                        Fatto
                      </button>
                      <button 
                        onClick={() => onStatusChange(b.id, BookingStatus.CANCELLED)}
                        className="flex-1 text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        Annulla
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {filteredBookings.filter(b => b.barberId === barber.id).length === 0 && (
                <div className="text-center py-20 text-gray-700 italic border-2 border-dashed border-white/5 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px]">
                  Disponibile
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN CONTENT WRAPPER ---
const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  // Shared state between client and admin
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('albibarber_bookings');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('albibarber_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('albibarber_auth') === 'true';
  });

  const [lastBooking, setLastBooking] = useState<Booking | null>(null);

  useEffect(() => {
    localStorage.setItem('albibarber_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('albibarber_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('albibarber_auth', isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleBookingComplete = (booking: Booking) => {
    setBookings([booking, ...bookings]);
    setLastBooking(booking);
  };

  const handleStatusChange = (id: string, status: BookingStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleReset = () => {
    setLastBooking(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold-500 selection:text-black">
      {/* Navbar is only for public views */}
      {!isAdminPath && location.pathname !== '/login' && <Navbar />}
      
      <Routes>
        {/* PUBLIC CLIENT VIEWS */}
        <Route path="/" element={<HomeView />} />
        
        <Route path="/booking" element={
          lastBooking ? (
            <SuccessView booking={lastBooking} onReset={handleReset} />
          ) : (
            <BookingFlow services={services} onComplete={handleBookingComplete} />
          )
        } />

        <Route path="/portfolio" element={
          <div className="pt-32 px-4 pb-24 max-w-7xl mx-auto">
            <h1 className="text-7xl md:text-8xl font-black mb-16 text-center font-serif tracking-tighter leading-none uppercase">L'Arte del <br /> <span className="text-gold-500 italic">Dettaglio</span></h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="group overflow-hidden rounded-[3rem] relative aspect-square bg-zinc-900 border border-white/5 transition-all hover:scale-[1.02] shadow-2xl">
                  <img 
                    src={`https://picsum.photos/seed/hair${i}/800`} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                    alt="Work style example" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-10">
                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-gold-500 font-black text-[10px] uppercase tracking-[0.3em] mb-3">Signature Cut</p>
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Style Master {i+1}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        } />

        {/* AUTH VIEW */}
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/admin" replace /> : <LoginView onLogin={() => setIsLoggedIn(true)} />
        } />

        {/* PROTECTED ADMIN VIEWS */}
        <Route path="/admin/*" element={
          isLoggedIn ? (
            <div className="flex min-h-screen animate-in fade-in duration-500">
              <AdminSidebar onLogout={handleLogout} />
              <main className="flex-1 bg-black p-6 md:p-14 overflow-y-auto pt-24 lg:pt-14 relative">
                {/* Mobile Header (Hidden on Desktop) */}
                <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
                  <span className="font-serif font-black text-white tracking-tighter uppercase">Admin Panel</span>
                  <button onClick={handleLogout} className="bg-red-500/10 text-red-500 p-2.5 rounded-full hover:bg-red-500 hover:text-white transition-all">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>

                <Routes>
                  {/* Fixed: Pass services state to AdminDashboard */}
                  <Route index element={<AdminDashboard bookings={bookings} services={services} />} />
                  <Route path="calendar" element={<AdminCalendar bookings={bookings} onStatusChange={handleStatusChange} />} />
                  <Route path=":page" element={
                    <div className="min-h-[60vh] flex items-center justify-center text-center">
                      <div className="space-y-8">
                        <div className="w-20 h-20 bg-gold-600/10 rounded-full flex items-center justify-center mx-auto">
                          <Settings className="w-10 h-10 text-gold-500 animate-spin-slow" />
                        </div>
                        <div>
                          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none">Modulo <br /><span className="text-gold-500 italic">In Sviluppo</span></h2>
                          <p className="text-gray-500 font-bold max-w-sm mx-auto uppercase tracking-widest text-[10px]">Implementazione prevista per la Versione 2.0</p>
                        </div>
                        <Link to="/admin" className="inline-block bg-white text-black font-black py-5 px-14 rounded-full hover:bg-gold-500 transition-all shadow-xl uppercase tracking-widest text-xs">TORNA ALLA DASHBOARD</Link>
                      </div>
                    </div>
                  } />
                </Routes>
              </main>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer is only for public views */}
      {!isAdminPath && location.pathname !== '/login' && <Footer />}
    </div>
  );
};

// --- MAIN APP ---
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
