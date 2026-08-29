import { useState, useEffect } from 'react';
import { Menu, Clock, Phone, MapPin, Calendar, Leaf, Sparkles, ChevronDown } from 'lucide-react';

// Shared types and static data
import { Language, CartItem, MenuItem } from './types';
import { OPENING_HOURS } from './data';

// Modular components
import AudioPlayer from './components/AudioPlayer';
import ThemeToggle from './components/ThemeToggle';
import LanguageToggle from './components/LanguageToggle';
import InteractiveMenu from './components/InteractiveMenu';
import ClickAndCollect from './components/ClickAndCollect';
import BookingSystem from './components/BookingSystem';
import CustomerReviews from './components/CustomerReviews';
import MapAndAccess from './components/MapAndAccess';
import Newsletter from './components/Newsletter';
import FooterCompliances from './components/FooterCompliances';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'fr' || saved === 'en') ? saved : 'fr';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Synchronize language selection
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // Synchronize shopping cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Handle adding an item to the Click & Collect cart
  const handleAddToCart = (menuItem: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: 'cart_' + Date.now() + '_' + menuItem.id, menuItem, quantity: 1 }];
    });
  };

  // Update item quantities in cart
  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  // Remove a specific item from cart
  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Clear shopping cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Quick lookup table for cart quantities in menu items
  const cartQuantities = cart.reduce((acc, item) => {
    acc[item.menuItem.id] = item.quantity;
    return acc;
  }, {} as { [key: string]: number });

  // Smooth scroll handler to targeted section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors duration-300 font-sans antialiased overflow-x-hidden">
      
      {/* 1. Header & Navigation (Sticky top, Glassmorphism backdrop, page 81) */}
      <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo Left */}
            <div 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 cursor-pointer group shrink-0 select-none"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-display font-extrabold text-sm shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform">
                LPF
              </div>
              <span className="font-display font-extrabold text-base tracking-tight text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Les Petites Faims
              </span>
            </div>

            {/* Interactive Control Toggles Right */}
            <div className="flex items-center gap-2">
              <AudioPlayer lang={lang} />
              <LanguageToggle currentLang={lang} onLanguageChange={setLang} />
              <ThemeToggle />
            </div>

          </div>
        </div>
      </header>

      {/* 2. Hero Section (Immersive, fullscreen aesthetic, above the fold, page 80) */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-neutral-950 overflow-hidden py-16">
        
        {/* Background Image with Dark Gradient Overlay for readability (SCA compliance, WCAG AA) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/petites_faims_hero_1783682094027.jpg"
            alt="Warm Paris Bistrot Interior"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 scale-105 animate-blur-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/40 z-0" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          
          <div className="inline-flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/20 text-blue-400 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-mono animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{lang === 'fr' ? 'Traditionnel • Fait Maison • Convivial' : 'Traditional • Homemade • Friendly'}</span>
          </div>

          <h1 className="text-6xl sm:text-9xl font-display font-black tracking-tighter text-white uppercase leading-[0.8] animate-letter-spacing">
            Les<br />Petites<br />
            <span className="outline-text">Faims</span>
          </h1>

          {/* Catchphrase (short and punchy, max 3 sentences per block, page 80) */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-300 leading-relaxed font-sans font-light animate-fade-in">
            {lang === 'fr'
              ? 'L’art de la cuisine de bistrot faite maison au cœur de Clamart. Des ingrédients de saison issus de maraîchers d’Île-de-France et sublimés avec passion.'
              : 'The fine art of homemade brasserie cooking in Clamart. Seasonal ingredients carefully sourced in Ile-de-France and prepared with passion.'}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 animate-slide-in-up">
            <button
              onClick={() => scrollToSection('reservation-section')}
              className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer hover:scale-102 flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4.5 h-4.5" />
              <span>{lang === 'fr' ? 'Réserver une table' : 'Book a Table'}</span>
            </button>
            
            <button
              onClick={() => scrollToSection('menu-digital')}
              className="w-full sm:w-auto px-7 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-semibold border border-neutral-700 transition-all cursor-pointer hover:scale-102 flex items-center justify-center gap-1.5"
            >
              <Menu className="w-4.5 h-4.5" />
              <span>{lang === 'fr' ? 'Click & Collect' : 'Order Pickup'}</span>
            </button>
          </div>

          {/* Scroll Down Hint */}
          <div className="pt-8 animate-bounce">
            <button
              onClick={() => scrollToSection('infos-tap-bar')}
              className="p-2 rounded-full bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Scroll Down"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. "5 Infos à un Tap" Quick Access Sticky Bar (Page 12, Page 81) */}
      <div 
        id="infos-tap-bar" 
        className="sticky top-[64px] sm:top-[64px] z-20 w-full bg-blue-600 dark:bg-blue-600 text-white shadow-lg overflow-x-auto hide-scrollbar border-b border-blue-500/20"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-1 h-12 py-1 min-w-[500px]">
          
          {/* Item 1: Menu */}
          <button
            onClick={() => scrollToSection('menu-digital')}
            className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/10 text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer"
          >
            <Menu className="w-4 h-4 shrink-0" />
            <span>{lang === 'fr' ? 'Carte' : 'Menu'}</span>
          </button>

          {/* Item 2: Horaires */}
          <button
            onClick={() => scrollToSection('horaires-section')}
            className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/10 text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>{lang === 'fr' ? 'Horaires' : 'Hours'}</span>
          </button>

          {/* Item 3: Adresse */}
          <button
            onClick={() => scrollToSection('acces-restaurant')}
            className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/10 text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer"
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{lang === 'fr' ? 'Adresse' : 'Address'}</span>
          </button>

          {/* Item 4: Appeler (Clickable tel:) */}
          <a
            href="tel:+33141080894"
            className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/10 text-xs font-bold font-display uppercase tracking-wider text-center transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span>{lang === 'fr' ? 'Appeler' : 'Call'}</span>
          </a>

          {/* Item 5: Réserver */}
          <button
            onClick={() => scrollToSection('reservation-section')}
            className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg bg-amber-500 dark:bg-amber-500 text-neutral-900 hover:bg-amber-600 text-xs font-extrabold font-display uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{lang === 'fr' ? 'Réserver' : 'Reserve'}</span>
          </button>

        </div>
      </div>

      {/* 4. Traditional Storytelling & Featured Dish (Asymmetric 2-Column Bento grid, page 82) */}
      <section className="py-16 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Big Beautiful Dish Photo - 5/12 cols */}
            <div className="lg:col-span-5 relative group overflow-hidden rounded-3xl shadow-xl animate-slide-in-left">
              <img
                src="/src/assets/images/les_petites_faims_dish_1783682110134.jpg"
                alt="Signature Steak Frites with Béarnaise"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-xl p-3 text-white text-[11px] font-mono leading-relaxed">
                <span className="font-bold text-amber-400 block">{lang === 'fr' ? '📷 Plat Signature :' : '📷 Featured Plat:'}</span>
                {lang === 'fr'
                  ? 'Notre Steak Frites de Bistrot maison servi avec sa béarnaise émulsionnée chaque heure.'
                  : 'Classic Steak Frites, handcut and served with our hourly prepared béarnaise.'}
              </div>
            </div>

            {/* Right Column: Bio / Values (Asymmetric, comfortable, short texts, page 82) - 7/12 cols */}
            <div className="lg:col-span-7 space-y-6 animate-slide-in-right">
              
              <div className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-xs font-semibold">
                <Leaf className="w-3.5 h-3.5" />
                <span>{lang === 'fr' ? 'Savoir-Faire Artisanal' : 'Artisanal Commitment'}</span>
              </div>

              <h2 className="text-3xl font-display font-extrabold text-neutral-900 dark:text-white tracking-tight sm:text-4xl animate-letter-spacing">
                {lang === 'fr' ? 'Une cuisine humble et exigeante.' : 'Humble and demanding cuisine.'}
              </h2>

              <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans font-light">
                {/* Rule: Short texts, max 3 sentences per block, page 80 */}
                <p>
                  {lang === 'fr'
                    ? 'Le chef Lucas Bernard sélectionne rigoureusement chaque ingrédient chez les maraîchers et éleveurs d’Île-de-France. Tout est transformé et mitonné sur place, des jus corsés de viande aux sauces montées minute.'
                    : 'Chef Lucas Bernard carefully handpicks every ingredient from farmers and organic fields in Île-de-France. Everything is slow-cooked on premises, from full-bodied beef juices to light emulsions.'}
                </p>
                <p>
                  {lang === 'fr'
                    ? 'Chez Les Petites Faims, nous défendons l’authenticité des recettes brutes contre les surgelés industriels. Une démarche transparente récompensée par la fidélité de nos habitués clamartois.'
                    : 'At Les Petites Faims, we protect raw authenticity and classical family recipes over industrial microwave presets. A transparent ethos loved by our Clamart regulars.'}
                </p>
              </div>

              {/* Little highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                <div>
                  <span className="block text-2xl font-display font-extrabold text-blue-600 dark:text-blue-400">100%</span>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider font-mono">
                    {lang === 'fr' ? 'Faits Maison' : 'Homemade Guarantee'}
                  </span>
                </div>
                <div>
                  <span className="block text-2xl font-display font-extrabold text-blue-600 dark:text-blue-400">&lt; 50km</span>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider font-mono">
                    {lang === 'fr' ? 'Sourcing Local' : 'Local Sourcing'}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Interactive Menu Digital Section */}
      <InteractiveMenu
        lang={lang}
        onAddToCart={handleAddToCart}
        cartQuantities={cartQuantities}
      />

      {/* 6. Click & Collect Cart Integration Component */}
      <ClickAndCollect
        lang={lang}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onClearCart={handleClearCart}
        onRemoveItem={handleRemoveItem}
      />

      {/* 7. Booking System Component */}
      <BookingSystem lang={lang} />

      {/* 8. Customer Reviews Component */}
      <CustomerReviews lang={lang} />

      {/* 9. Map and Access Component */}
      <MapAndAccess lang={lang} />

      {/* 10. Newsletter subscription banner */}
      <Newsletter lang={lang} />

      {/* 11. Footer compliances and cookies settings */}
      <FooterCompliances lang={lang} />

    </div>
  );
}
