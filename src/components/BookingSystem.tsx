import { useState, useMemo, FormEvent } from 'react';
import { Calendar, Users, Clock, CheckCircle, ShieldCheck, AlertCircle, PlusCircle, MinusCircle, UserCheck } from 'lucide-react';
import { Language, Booking } from '../types';

interface BookingSystemProps {
  lang: Language;
}

export default function BookingSystem({ lang }: BookingSystemProps) {
  const [date, setDate] = useState('2026-07-10'); // Starts today
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Real-time capacities state (simulating database tables, page 49)
  const [maxCapacity, setMaxCapacity] = useState(45);
  const [onlineReservationsCount, setOnlineReservationsCount] = useState(28);
  const [walkinsCount, setWalkinsCount] = useState(8);

  // Walk-in form for manager panel (page 53-54)
  const [walkinName, setWalkinName] = useState('');
  const [walkinGuests, setWalkinGuests] = useState(2);
  const [managerMessage, setManagerMessage] = useState('');

  // Booking states
  const [isSubmitting, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<Booking | null>(null);
  const [overbookError, setOverbookError] = useState('');
  const [dbLogs, setDbLogs] = useState<string[]>([]);

  // Calculation of remaining spots (page 54: capacite_max - capacite_reservee - capacite_walkin)
  const spotsLeft = useMemo(() => {
    return Math.max(0, maxCapacity - onlineReservationsCount - walkinsCount);
  }, [maxCapacity, onlineReservationsCount, walkinsCount]);

  // opening slots
  const availableTimes = ['12:00', '12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00'];

  // Submit Reservation
  const handleBooking = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !time) return;

    setOverbookError('');
    setIsProcessing(true);
    setDbLogs([]);

    // Simulating database transaction steps with FOR UPDATE locks (page 51)
    setTimeout(() => {
      // 1. Check if requested group fits
      if (spotsLeft < guests) {
        setOverbookError(
          lang === 'fr' 
            ? `Désolé, il ne reste que ${spotsLeft} places disponibles pour ce créneau.` 
            : `Sorry, only ${spotsLeft} spots are available for this slot.`
        );
        setIsProcessing(false);
        return;
      }

      // 2. Perform transactional steps logs
      const logs = [
        `[BEGIN TRANSACTION] Isolation level: SERIALIZABLE`,
        `SELECT capacite_max, capacite_reservee, capacite_walkin FROM creneaux WHERE date_heure = '${date} ${time}' FOR UPDATE; -- [LOCKED ROW]`,
        `Verifying: ${onlineReservationsCount} (reserved) + ${walkinsCount} (walk-in) + ${guests} (requested) <= ${maxCapacity} (max)...`,
        `Integrity Check: OK. No race conditions possible due to exclusive row lock.`,
        `INSERT INTO reservations (name, email, phone, nb_personnes, time) VALUES ('${name}', '${email}', '${phone}', ${guests}, '${time}');`,
        `UPDATE creneaux SET capacite_reservee = capacite_reservee + ${guests} WHERE date_heure = '${date} ${time}';`,
        `[COMMIT TRANSACTION] Lock released on creneau.`
      ];
      setDbLogs(logs);

      // Increment reserved capacity
      setOnlineReservationsCount(prev => prev + guests);

      const bookingDetails: Booking = {
        id: 'RES-' + Math.floor(1000 + Math.random() * 9000),
        name,
        email,
        phone,
        guests,
        date,
        time,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      setBookingSuccess(bookingDetails);
      setIsProcessing(false);
    }, 1800);
  };

  // Walk-in simulation addition by the Manager (page 53-54)
  const handleAddWalkin = (e: FormEvent) => {
    e.preventDefault();
    setManagerMessage('');

    if (spotsLeft < walkinGuests) {
      setManagerMessage(
        lang === 'fr' 
          ? `⚠️ Capacité insuffisante ! Impossible d’ajouter ${walkinGuests} couverts.` 
          : `⚠️ Insufficient capacity! Cannot add ${walkinGuests} walk-in guests.`
      );
      return;
    }

    // Atomically increment walkins
    setWalkinsCount(prev => prev + walkinGuests);
    
    setManagerMessage(
      lang === 'fr'
        ? `✅ ${walkinGuests} couverts ajoutés en Walk-in ! Capacité mise à jour en temps réel.`
        : `✅ ${walkinGuests} walk-in guests added! Available capacity updated instantly.`
    );

    // Reset walk-in input
    setWalkinName('');
  };

  // Reset booking form
  const handleReset = () => {
    setBookingSuccess(null);
    setName('');
    setEmail('');
    setPhone('');
    setGuests(2);
    setDbLogs([]);
  };

  return (
    <section id="reservation-section" className="py-12 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-display font-bold text-neutral-900 dark:text-white tracking-tight sm:text-4xl animate-letter-spacing">
            {lang === 'fr' ? 'Réserver une Table' : 'Book a Table'}
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            {lang === 'fr'
              ? 'Réservez gratuitement votre table 24h/24. Confirmation immédiate garantie anti-surbooking grâce à notre technologie.'
              : 'Book your table for free 24/7. Immediate confirmation guaranteed against double bookings.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Booking Interface - 7/12 cols */}
          <div className="lg:col-span-7 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm animate-slide-in-left">
            
            {/* Live spots banner */}
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 p-4 rounded-xl mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300">
                    {lang === 'fr' ? 'Capacité Actuelle du Service' : 'Current Service Capacity'}
                  </h4>
                  <p className="text-[10px] text-blue-700 dark:text-blue-400/80 mt-0.5 leading-relaxed">
                    {lang === 'fr'
                      ? `Salle : ${maxCapacity} couverts max | Réservé en ligne : ${onlineReservationsCount} | Walk-ins : ${walkinsCount}`
                      : `Room: ${maxCapacity} covers max | Booked online: ${onlineReservationsCount} | Walk-ins: ${walkinsCount}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {spotsLeft}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500 font-mono">
                  {lang === 'fr' ? 'Places Libres' : 'Spots Left'}
                </span>
              </div>
            </div>

            {/* ERROR IF FULL */}
            {spotsLeft === 0 && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl flex gap-2 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold">{lang === 'fr' ? 'Créneau complet !' : 'Fully Booked!'}</span>{' '}
                  {lang === 'fr'
                    ? 'Le service est actuellement saturé. Veuillez choisir un autre jour ou libérer de la capacité via le panneau gérant.'
                    : 'The service is fully booked. Please select another date or release capacity from the manager panel.'}
                </div>
              </div>
            )}

            {!bookingSuccess ? (
              <form onSubmit={handleBooking} className="space-y-4">
                
                {/* 1. Guests, Date, Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{lang === 'fr' ? 'Convives' : 'Guests'}</span>
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full py-2 px-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-800 dark:text-white text-xs cursor-pointer focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>{n} {n > 1 ? (lang === 'fr' ? 'personnes' : 'guests') : (lang === 'fr' ? 'personne' : 'guest')}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{lang === 'fr' ? 'Date' : 'Date'}</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-800 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{lang === 'fr' ? 'Heure' : 'Time'}</span>
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full py-2 px-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-800 dark:text-white text-xs cursor-pointer focus:ring-2 focus:ring-blue-500"
                    >
                      {availableTimes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Customer Coordonnées */}
                <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {lang === 'fr' ? 'Nom complet' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Charles Leroux"
                        className="w-full px-3.5 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {lang === 'fr' ? 'Numéro de téléphone' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g., +33 6 98 76 54 32"
                        className="w-full px-3.5 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      {lang === 'fr' ? 'Adresse email' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="charles@email.com"
                      className="w-full px-3.5 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {overbookError && (
                  <p className="text-xs font-semibold text-red-500">{overbookError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || spotsLeft === 0}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    spotsLeft === 0
                      ? 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{lang === 'fr' ? 'Exécution du verrou Postgres...' : 'Executing Postgres Row Lock...'}</span>
                    </span>
                  ) : (
                    <span>{lang === 'fr' ? 'Réserver ma table' : 'Confirm My Table'}</span>
                  )}
                </button>
              </form>
            ) : (
              // Booking Confirmed Panel
              <div className="text-center py-8 space-y-4 animate-fade-in">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {lang === 'fr' ? 'Réservation Confirmée ! 🎉' : 'Reservation Confirmed! 🎉'}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {lang === 'fr'
                      ? `Votre table est bloquée d’office pour le ${bookingSuccess.date} à ${bookingSuccess.time}.`
                      : `Your table is locked and secured for ${bookingSuccess.date} at ${bookingSuccess.time}.`}
                  </p>
                  <p className="text-sm font-mono font-bold text-blue-600 mt-2 tracking-wider bg-blue-50 dark:bg-blue-950/20 py-1 px-3 inline-block rounded">
                    {bookingSuccess.id}
                  </p>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-neutral-100 dark:bg-neutral-800/40 text-left text-xs space-y-1 font-mono text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>{lang === 'fr' ? 'Nom :' : 'Name:'}</span>
                    <span className="text-neutral-900 dark:text-white font-sans">{bookingSuccess.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'fr' ? 'Couverts :' : 'Covers:'}</span>
                    <span className="text-neutral-900 dark:text-white font-sans">{bookingSuccess.guests} {bookingSuccess.guests > 1 ? 'personnes' : 'personne'}</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-bold cursor-pointer"
                >
                  {lang === 'fr' ? 'Faire une nouvelle réservation' : 'New Booking'}
                </button>
              </div>
            )}

            {/* Postgres SQL simulated transaction logs (page 51) */}
            {dbLogs.length > 0 && (
              <div className="mt-6 border-t border-neutral-200 dark:border-neutral-800 pt-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>{lang === 'fr' ? 'Vérification de Cohérence (Postgres FOR UPDATE)' : 'Consistency Verification (Postgres FOR UPDATE)'}</span>
                </div>
                <div className="bg-neutral-950 rounded-lg p-3 font-mono text-[9px] text-green-400 space-y-1 select-none overflow-x-auto shadow-inner leading-relaxed">
                  <div className="text-neutral-500 pb-1 border-b border-neutral-900 mb-1">
                    &gt;_ DATABASE TRANSACTION ENGINE
                  </div>
                  {dbLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Interactive Gérant Panel - 5/12 cols (Walk-ins management, page 53-54) */}
          <div className="lg:col-span-5 bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-inner animate-slide-in-right">
            <div className="flex items-center gap-2 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <UserCheck className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-xs font-bold text-neutral-800 dark:text-white uppercase tracking-wider font-mono">
                  {lang === 'fr' ? '🔑 Console Gérant (Walk-Ins)' : '🔑 Manager Console (Walk-Ins)'}
                </h3>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  {lang === 'fr' ? 'Saisie des clients physiques à la volée.' : 'Log walk-ins entering the restaurant.'}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              {lang === 'fr'
                ? 'Section 5 de la spécification : Le gérant enregistre directement les clients arrivant sans réservation. Cela décrémente instantanément la capacité disponible en ligne pour éliminer tout surbooking.'
                : 'Section 5 of specification: Manager registers guests entering without booking. This immediately reduces available online spots to secure absolute data integrity.'}
            </p>

            <form onSubmit={handleAddWalkin} className="space-y-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1 font-mono">
                  {lang === 'fr' ? 'Nom ou N° de table' : 'Name / Table N°'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Table 4"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1 font-mono flex justify-between items-center">
                  <span>{lang === 'fr' ? 'Couverts Walk-in' : 'Walk-in Guests'}</span>
                  <span className="font-mono text-blue-600 text-xs">{walkinGuests} {lang === 'fr' ? 'pers.' : 'pax'}</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setWalkinGuests(prev => Math.max(1, prev - 1))}
                    className="p-1 hover:text-blue-500 cursor-pointer text-neutral-600 dark:text-neutral-400"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={walkinGuests}
                    onChange={(e) => setWalkinGuests(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setWalkinGuests(prev => Math.min(10, prev + 1))}
                    className="p-1 hover:text-blue-500 cursor-pointer text-neutral-600 dark:text-neutral-400"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-900 dark:bg-neutral-200 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg text-[10px] font-bold tracking-wider uppercase font-mono transition-all cursor-pointer"
              >
                {lang === 'fr' ? '🔗 Enregistrer Walk-in (Atomique)' : '🔗 Register Walk-in (Atomic)'}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWalkinsCount(0);
                    setManagerMessage(lang === 'fr' ? 'Walk-ins réinitialisés !' : 'Walk-ins reset!');
                  }}
                  className="w-1/2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[9px] uppercase tracking-wider font-mono cursor-pointer"
                >
                  {lang === 'fr' ? 'Réinitialiser' : 'Reset Walkins'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOnlineReservationsCount(0);
                    setManagerMessage(lang === 'fr' ? 'Réservations vidées !' : 'Reservations cleared!');
                  }}
                  className="w-1/2 py-1 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-[9px] uppercase tracking-wider font-mono cursor-pointer"
                >
                  {lang === 'fr' ? 'Vider en ligne' : 'Clear Online'}
                </button>
              </div>
            </form>

            {managerMessage && (
              <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-3 text-center bg-blue-500/5 py-2 rounded-lg border border-blue-500/10">
                {managerMessage}
              </p>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
