import { useState, FormEvent } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface NewsletterProps {
  lang: Language;
}

export default function Newsletter({ lang }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [doubleOptIn, setDoubleOptIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !doubleOptIn) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setPromoCode('PETITESFAIMS10');
      setEmail('');
      setDoubleOptIn(false);
    }, 1200);
  };

  return (
    <section id="newsletter-section" className="py-12 bg-neutral-900 text-white border-b border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-display font-bold tracking-tight sm:text-3xl text-white animate-letter-spacing">
            {lang === 'fr' ? 'Rejoignez le Club Gourmand' : 'Join the Gourmet Club'}
          </h2>
          <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
            {lang === 'fr'
              ? 'Inscrivez-vous à notre newsletter mensuelle. Pas de spam, uniquement des annonces sur nos nouvelles cartes de saison, nos événements spéciaux à Clamart, et des offres exclusives.'
              : 'Subscribe to our monthly newsletter. No spam, only seasonal menu releases, special culinary events in Clamart, and exclusive offers.'}
          </p>
        </div>

        <div className="mt-6 max-w-md mx-auto">
          {!success ? (
            <form onSubmit={handleSubscribe} className="space-y-3">
              
              {/* Email + Send Button Row */}
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'fr' ? 'Saisissez votre email...' : 'Enter your email...'}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button
                  type="submit"
                  disabled={isSubmitting || !doubleOptIn}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow ${
                    doubleOptIn 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{lang === 'fr' ? 'S’abonner' : 'Subscribe'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* RGPD Double Opt-In consent checkbox - Page 28 */}
              <div className="text-left bg-neutral-950/40 p-3 rounded-xl border border-neutral-800 mt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doubleOptIn}
                    onChange={(e) => setDoubleOptIn(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5 accent-blue-600 cursor-pointer"
                  />
                  <div className="text-[10px] text-neutral-400 leading-relaxed font-sans select-none">
                    <span>
                      {lang === 'fr'
                        ? 'J’accepte que la SAS Les Petites Faims stocke mon adresse email pour m’envoyer sa lettre d’information mensuelle. Je certifie avoir lu et validé la '
                        : 'I consent to Les Petites Faims storing my email address to send me monthly newsletters. I certify I have read the '}
                    </span>
                    <span className="text-blue-400 font-bold hover:underline">
                      {lang === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
                    </span>
                    <span>. {lang === 'fr' ? 'Désabonnement immédiat en un seul clic à tout moment.' : 'Easy one-click unsubscribe at any time.'}</span>
                  </div>
                </label>
              </div>

            </form>
          ) : (
            // SUBMISSION SUCCESS CARD & PROMO CODE DELIVERED
            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-3 animate-scale-up">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {lang === 'fr' ? 'Bienvenue au Club ! 🎉' : 'Welcome to the Club! 🎉'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {lang === 'fr'
                    ? 'Votre abonnement a été pris en compte. Pour vous remercier, voici votre code de réduction de 10% sur votre prochain repas :'
                    : 'Your subscription is active. Here is your 10% discount promo code for your next meal:'}
                </p>
                <div className="mt-3 inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-bold tracking-widest text-sm py-1.5 px-6 rounded-xl animate-pulse">
                  {promoCode}
                </div>
                <p className="text-[9px] text-neutral-500 mt-2">
                  {lang === 'fr'
                    ? '* À renseigner lors de votre retrait Click & Collect ou à présenter en salle.'
                    : '* Simply present this code at checkout or mention it during your next table service.'}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
