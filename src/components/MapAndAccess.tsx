import { useState } from 'react';
import { MapPin, Copy, Check, Bus, Car, Eye } from 'lucide-react';
import { Language } from '../types';

interface MapAndAccessProps {
  lang: Language;
}

export default function MapAndAccess({ lang }: MapAndAccessProps) {
  const [copied, setCopied] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const addressText = "21 Rue Lazare Carnot, 92140 Clamart, France";

  const handleCopy = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="acces-restaurant" className="py-12 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Info and access details - 5/12 cols */}
          <div className="lg:col-span-5 flex flex-col justify-between animate-slide-in-left">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>{lang === 'fr' ? 'Nous Trouver' : 'Visit Us'}</span>
              </div>
              
              <h2 className="text-3xl font-display font-bold text-neutral-900 dark:text-white tracking-tight sm:text-4xl animate-letter-spacing">
                {lang === 'fr' ? 'Accès & Coordonnées' : 'Location & Access'}
              </h2>
              
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {lang === 'fr'
                  ? 'Situé au cœur historique de Clamart, le restaurant Les Petites Faims vous accueille dans un cadre chaleureux et convivial.'
                  : 'Located in the historic center of Clamart, Les Petites Faims welcomes you to a cozy and inviting bistro atmosphere.'}
              </p>

              {/* Exact copiable address card */}
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl mt-6">
                <span className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400 mb-1 font-mono">
                  {lang === 'fr' ? 'Adresse Officielle (NAP)' : 'Official NAP Address'}
                </span>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white font-sans">
                    {addressText}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg text-neutral-600 dark:text-neutral-400 transition-all cursor-pointer shadow-sm relative group shrink-0"
                    title={lang === 'fr' ? 'Copier l’adresse' : 'Copy address'}
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500 animate-scale-up" /> : <Copy className="w-4 h-4" />}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-sans pointer-events-none select-none">
                      {copied ? (lang === 'fr' ? 'Copié !' : 'Copied!') : (lang === 'fr' ? 'Copier' : 'Copy')}
                    </span>
                  </button>
                </div>
              </div>

              {/* Accessibilities: Public transport & Car/Parking */}
              <div className="space-y-4 mt-6">
                
                {/* 1. Transports en commun */}
                <div className="flex gap-3">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {lang === 'fr' ? 'En transports en commun' : 'By Public Transport'}
                    </h4>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                      {lang === 'fr'
                        ? 'RER B Robinson puis Bus 162 ou 189 (Arrêt Clamart - Centre) ou Métro 12 Mairie d’Issy puis Bus 189.'
                        : 'Take RER B to Robinson then Bus 162 or 189 (Clamart - Centre stop) or Metro 12 Mairie d’Issy then Bus 189.'}
                    </p>
                  </div>
                </div>

                {/* 2. En voiture & Parkings */}
                <div className="flex gap-3">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {lang === 'fr' ? 'En voiture & Stationnement' : 'By Car & Parking'}
                    </h4>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                      {lang === 'fr'
                        ? 'Accès rapide par la N118 ou D906. Parking Indigo Clamart Centre à 200m (gratuit pendant 1 heure).'
                        : 'Quick access via N118 or D906. Parking Indigo Clamart Centre is 200m away (first hour is free).'}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-900 text-left">
              <button
                onClick={() => setShowDirections(!showDirections)}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>
                  {showDirections
                    ? (lang === 'fr' ? 'Masquer l’itinéraire détaillé' : 'Hide detailed directions')
                    : (lang === 'fr' ? 'Voir l’itinéraire détaillé' : 'Show detailed directions')
                  }
                </span>
              </button>

              {showDirections && (
                <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-1 animate-fade-in font-sans">
                  <p className="font-bold text-neutral-800 dark:text-neutral-200 mb-1">{lang === 'fr' ? 'Instructions :' : 'Step-by-step:'}</p>
                  <p>{lang === 'fr' ? '1. Depuis l’Hôtel de Ville de Clamart, marchez 3 min vers l’Est.' : '1. From Clamart City Hall, walk 3 minutes East.'}</p>
                  <p>{lang === 'fr' ? '2. Prenez à droite sur la Rue Lazare Carnot.' : '2. Turn right onto Rue Lazare Carnot.'}</p>
                  <p>{lang === 'fr' ? '3. Le restaurant Les Petites Faims se trouve sur votre gauche au numéro 21.' : '3. Les Petites Faims is on your left at number 21.'}</p>
                </div>
              )}
            </div>

          </div>

          {/* Right panel: Lazy-loaded Google Maps iframe - 7/12 cols */}
          <div className="lg:col-span-7 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden min-h-[350px] relative shadow-inner animate-slide-in-right">
            <iframe
              src="https://maps.google.com/maps?q=Les%20Petites%20Faims%20Clamart%20France&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full grayscale dark:invert dark:opacity-85 transition-all duration-300"
              title="Les Petites Faims Google Maps Location"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
