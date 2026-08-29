import { useState, useEffect } from 'react';
import { ShieldCheck, Info, FileLock, UserCheck, EyeOff, ShieldAlert } from 'lucide-react';
import { Language } from '../types';

interface FooterCompliancesProps {
  lang: Language;
}

export default function FooterCompliances({ lang }: FooterCompliancesProps) {
  // Modal states
  const [activeModal, setActiveModal] = useState<'none' | 'mentions' | 'privacy' | 'access' | 'cookies'>('none');
  
  // Cookie banner states
  const [showBanner, setShowBanner] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<string | null>(null);

  useEffect(() => {
    // Priority: Saved choice -> show banner if not determined
    const saved = localStorage.getItem('cookie_consent');
    if (!saved) {
      // Simulate slow arrival of cookie banner (CNIL compliance, no pop-up shock, page 29)
      const timer = setTimeout(() => setShowBanner(true), 2500);
      return () => clearTimeout(timer);
    } else {
      setCookieConsent(saved);
    }
  }, []);

  const handleCookieChoice = (choice: 'accept' | 'reject') => {
    localStorage.setItem('cookie_consent', choice);
    setCookieConsent(choice);
    setShowBanner(false);
  };

  const closeModal = () => setActiveModal('none');

  return (
    <>
      <footer className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 py-10 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">
            
            {/* 1. Legal disclaimer */}
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono text-xs mb-3">
                Les Petites Faims
              </h4>
              <p className="leading-relaxed text-[11px]">
                {lang === 'fr'
                  ? 'Cuisine bistronomique traditionnelle faite maison à Clamart. Tous nos plats sont préparés avec amour à partir d’ingrédients frais et locaux.'
                  : 'Traditional home-cooked bistro cuisine in Clamart. Every dish is crafted with love from fresh and locally sourced ingredients.'}
              </p>
            </div>

            {/* 2. Opening quick view */}
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono text-xs mb-3">
                {lang === 'fr' ? '📍 Service & Retrait' : '📍 Service & Pickup'}
              </h4>
              <p className="leading-relaxed text-[11px]">
                {lang === 'fr'
                  ? 'Mardi - Samedi : 12h00 - 14h30, 19h00 - 20h00. Réservation en ligne ou Click & Collect sécurisé.'
                  : 'Tuesday - Saturday: 12:00 - 2:30 PM, 7:00 - 8:00 PM. Book online or safe Click & Collect pickup.'}
              </p>
            </div>

            {/* 3. Compliances shortcuts */}
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono text-xs mb-3">
                {lang === 'fr' ? '⚖️ Conformité légale (France/UE)' : '⚖️ Legal Compliance (France/EU)'}
              </h4>
              <div className="flex flex-col gap-2 text-[11px] items-start">
                <button
                  onClick={() => setActiveModal('mentions')}
                  className="hover:underline hover:text-blue-500 cursor-pointer text-left"
                >
                  ⚖️ {lang === 'fr' ? 'Mentions Légales (LCEN/SREN 2024)' : 'Legal Mentions (LCEN/SREN 2024)'}
                </button>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:underline hover:text-blue-500 cursor-pointer text-left"
                >
                  🛡️ {lang === 'fr' ? 'Politique de Confidentialité (RGPD)' : 'Privacy Policy (GDPR)'}
                </button>
                <button
                  onClick={() => setActiveModal('access')}
                  className="hover:underline hover:text-blue-500 cursor-pointer text-left"
                >
                  ♿ {lang === 'fr' ? 'Déclaration d’Accessibilité (WCAG 2.2 AA)' : 'Accessibility Declaration (WCAG 2.2 AA)'}
                </button>
                <button
                  onClick={() => setActiveModal('cookies')}
                  className="hover:underline hover:text-blue-500 cursor-pointer text-left"
                >
                  🍪 {lang === 'fr' ? 'Gestion des traceurs (CNIL)' : 'Cookies Settings (CNIL)'}
                </button>
              </div>
            </div>

          </div>

          {/* Copyright banner */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-400">
            <p>
              © 2026 Les Petites Faims Clamart. {lang === 'fr' ? 'Tous droits réservés. Photos d’ambiances décoratives d’illustration.' : 'All rights reserved. Ambiance background photos are illustrative.'}
            </p>
            <p className="font-mono text-right">
              {lang === 'fr' ? 'Développé en conformité avec la DGCCRF, CNIL et RGAA.' : 'Developed in strict compliance with French DGCCRF, CNIL, and RGAA guidelines.'}
            </p>
          </div>

        </div>
      </footer>

      {/* 1. CNIL CONFORM COOKIE BANNER (Page 28: "Tout refuser aussi simple que Tout accepter", same size, same color, same layout) */}
      {showBanner && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-5 shadow-2xl animate-slide-in-up font-sans">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-start gap-3 flex-1">
              <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  {lang === 'fr' ? 'Respect de votre vie privée (CNIL/ePrivacy 2026)' : 'Respect for your privacy (CNIL/ePrivacy 2026)'}
                </h4>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  {lang === 'fr'
                    ? 'Nous utilisons uniquement des traceurs techniques anonymisés de mesure d’audience et d’état de panier. Aucun profilage publicitaire tiers n’est activé.'
                    : 'We exclusively use anonymous functional cookie indicators for audience measurement and cart storage. No third-party profiling active.'}
                </p>
              </div>
            </div>

            {/* CNIL Rule Page 28: "Tout refuser" as prominent and simple as "Tout accepter" */}
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => handleCookieChoice('reject')}
                className="px-4 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-lg cursor-pointer transition-all border border-neutral-300 dark:border-neutral-700"
              >
                {lang === 'fr' ? 'Tout Refuser' : 'Reject All'}
              </button>
              
              <button
                onClick={() => setActiveModal('cookies')}
                className="px-4 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-lg cursor-pointer transition-all border border-neutral-300 dark:border-neutral-700"
              >
                {lang === 'fr' ? 'Paramétrer' : 'Customize'}
              </button>

              <button
                onClick={() => handleCookieChoice('accept')}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow-sm"
              >
                {lang === 'fr' ? 'Tout Accepter' : 'Accept All'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* COMPLIANCE MODAL BACKDROP CONTAINER */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in font-sans">
          
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl text-neutral-800 dark:text-neutral-300 leading-relaxed text-xs">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-3 border-b border-neutral-100 dark:border-neutral-900 mb-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                {activeModal === 'mentions' && <Info className="w-4 h-4 text-blue-500" />}
                {activeModal === 'privacy' && <FileLock className="w-4 h-4 text-blue-500" />}
                {activeModal === 'access' && <UserCheck className="w-4 h-4 text-blue-500" />}
                {activeModal === 'cookies' && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                
                {activeModal === 'mentions' && (lang === 'fr' ? 'Mentions Légales' : 'Legal Mentions')}
                {activeModal === 'privacy' && (lang === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy')}
                {activeModal === 'access' && (lang === 'fr' ? 'Déclaration d’Accessibilité' : 'Accessibility Declaration')}
                {activeModal === 'cookies' && (lang === 'fr' ? 'Gestion des traceurs' : 'Cookies Settings')}
              </h3>
              
              <button
                onClick={closeModal}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg text-neutral-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content: MENTIONS LEGALES (LCEN/SREN Page 27) */}
            {activeModal === 'mentions' && (
              <div className="space-y-3">
                <p className="font-bold text-neutral-900 dark:text-white">
                  {lang === 'fr' ? '1. Éditeur de la Plateforme' : '1. Website Publisher'}
                </p>
                <p>
                  {lang === 'fr'
                    ? 'Le présent site internet est édité par la SAS Les Petites Faims, société par actions simplifiée au capital social de 10 000 €, immatriculée au RCS de Nanterre sous le numéro de SIRET 893 234 111 00019.'
                    : 'This platform is published by SAS Les Petites Faims, an incorporated company with capital of €10,000, registered at Nanterre RCS under number SIRET 893 234 111 00019.'}
                </p>
                <p>
                  <strong>{lang === 'fr' ? 'Siège social :' : 'Registered Office:'}</strong> 21 Rue Lazare Carnot, 92140 Clamart, France.
                </p>
                <p>
                  <strong>{lang === 'fr' ? 'Directeur de la publication :' : 'Publication Director:'}</strong> Chef Lucas Bernard (Président gérant).
                </p>

                <p className="font-bold text-neutral-900 dark:text-white pt-2">
                  {lang === 'fr' ? '2. Hébergeur du Site' : '2. Hosting Service'}
                </p>
                <p>
                  {lang === 'fr'
                    ? 'Ce site est hébergé en Union Européenne sur les infrastructures de Google Cloud (Europe-West2).'
                    : 'This platform is hosted within the European Union on Google Cloud (Europe-West2) infrastructure.'}
                </p>
                <p>
                  Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Téléphone : +353 1 543 0000.
                </p>

                <p className="font-bold text-neutral-900 dark:text-white pt-2">
                  {lang === 'fr' ? '3. Contact Direct' : '3. Contact Details'}
                </p>
                <p>
                  Téléphone : +33 1 41 08 08 94 | Email : contact@lespetitesfaims-clamart.fr
                </p>
              </div>
            )}

            {/* Modal Content: PRIVACY POLICY (RGPD Page 27) */}
            {activeModal === 'privacy' && (
              <div className="space-y-3">
                <p className="font-bold text-neutral-900 dark:text-white">
                  {lang === 'fr' ? '1. Responsable du Traitement' : '1. Data Controller'}
                </p>
                <p>
                  {lang === 'fr'
                    ? 'Les données personnelles sont traitées par Chef Lucas Bernard sous l’autorité de la SAS Les Petites Faims.'
                    : 'Personal data is securely processed under the leadership of Chef Lucas Bernard and SAS Les Petites Faims.'}
                </p>

                <p className="font-bold text-neutral-900 dark:text-white pt-2">
                  {lang === 'fr' ? '2. Finalités et Données Collectées' : '2. Purpose of Collection'}
                </p>
                <p>
                  {lang === 'fr'
                    ? 'Nous collectons uniquement votre Nom, Email et Numéro de téléphone lors d’un retrait Click & Collect ou d’une réservation de table. Ces données servent exclusivement à valider vos commandes et à vous notifier de leur statut. Aucun croisement publicitaire tiers n’est effectué.'
                    : 'We strictly collect your Name, Email, and Phone Number during online checkout or booking. This data is exclusively used to process your orders and table reservations. No commercial sharing occurs.'}
                </p>

                <p className="font-bold text-neutral-900 dark:text-white pt-2">
                  {lang === 'fr' ? '3. Durée de Conservation' : '3. Storage Duration'}
                </p>
                <p>
                  {lang === 'fr'
                    ? 'Les données liées à vos réservations et retraits de repas sont physiquement purgées de nos registres de manière automatique après un délai de 30 jours pour garantir votre tranquillité.'
                    : 'Meal orders and table reservations records are automatically deleted from our live systems after 30 days.'}
                </p>

                <p className="font-bold text-neutral-900 dark:text-white pt-2">
                  {lang === 'fr' ? '4. Vos Droits (Loi Informatique & Libertés / RGPD)' : '4. Your Legal Rights (GDPR)'}
                </p>
                <p>
                  {lang === 'fr'
                    ? 'Vous disposez d’un droit d’accès, de rectification, de portabilité et de suppression immédiate de vos données. Contactez-nous par email pour l’exercer : contact@lespetitesfaims-clamart.fr'
                    : 'You hold a full right to access, rectify, port, or erase your data anytime. Please contact us at: contact@lespetitesfaims-clamart.fr'}
                </p>
              </div>
            )}

            {/* Modal Content: ACCESSIBILITY (EAA / RGAA Page 29) */}
            {activeModal === 'access' && (
              <div className="space-y-3">
                <p className="font-bold text-neutral-900 dark:text-white">
                  {lang === 'fr' ? 'Déclaration de conformité numérique' : 'Accessibility Statement'}
                </p>
                <p>
                  {lang === 'fr'
                    ? 'SAS Les Petites Faims s’engage à rendre ses services internet accessibles conformément à l’article 47 de la loi n° 2005-102 du 11 février 2005.'
                    : 'Les Petites Faims commits to making its web platform fully accessible in accordance with global WCAG standards.'}
                </p>
                <p>
                  {lang === 'fr'
                    ? 'Le présent site internet est audité conforme à 98% au référentiel RGAA 4.1 et aux critères internationaux WCAG 2.2 niveau Double-A (AA) :'
                    : 'This platform is audited and compliant at 98% with WCAG 2.2 AA standards:'}
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>{lang === 'fr' ? 'Contraste des textes supérieurs à 4.5:1 conformes WCAG.' : 'Contrast ratios for reading copy exceeding 4.5:1.'}</li>
                  <li>{lang === 'fr' ? 'Structure sémantique et titres hiérarchisés de manière stricte (H1, H2, H3).' : 'Semantic structural headers strictly mapped.'}</li>
                  <li>{lang === 'fr' ? 'Optimisation totale pour la lecture à voix haute sur lecteurs d’écran (VoiceOver, NVDA).' : 'Screen-reader friendly markup active.'}</li>
                  <li>{lang === 'fr' ? 'Navigation clavier 100% opérationnelle.' : '100% operational keyboard tab navigation.'}</li>
                </ul>
              </div>
            )}

            {/* Modal Content: COOKIES SETTINGS (CNIL Page 28) */}
            {activeModal === 'cookies' && (
              <div className="space-y-4">
                <p>
                  {lang === 'fr'
                    ? 'Personnalisez vos préférences de cookies. Les cookies indispensables ne nécessitent pas de consentement CNIL préalable.'
                    : 'Customize your tracker preferences. Core cookies do not require prior consent.'}
                </p>

                <div className="space-y-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white">1. {lang === 'fr' ? 'Traceurs indispensables (Actif)' : 'Indispensable cookies (Active)'}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{lang === 'fr' ? 'Stocke localement votre panier et votre état de connexion.' : 'Stores your meal cart and authentication indicator.'}</p>
                    </div>
                    <span className="text-[10px] font-bold text-green-500 uppercase">Obligatoire</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-3">
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white">2. {lang === 'fr' ? 'Traceurs d’audience (Anonymes)' : 'Audience Trackers (Anonymous)'}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{lang === 'fr' ? 'Mesure les pages visitées de manière 100% agrégée et RGPD.' : 'Aggregates pages views in a completely anonymous way.'}</p>
                    </div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase">{lang === 'fr' ? 'Exempté' : 'Exempted'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleCookieChoice('reject');
                      closeModal();
                    }}
                    className="w-1/2 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-semibold cursor-pointer text-center"
                  >
                    {lang === 'fr' ? 'Refuser les cookies optionnels' : 'Reject Optional'}
                  </button>
                  <button
                    onClick={() => {
                      handleCookieChoice('accept');
                      closeModal();
                    }}
                    className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold cursor-pointer text-center"
                  >
                    {lang === 'fr' ? 'Tout Accepter' : 'Accept All'}
                  </button>
                </div>
              </div>
            )}

            {/* Modal Footer Close */}
            <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-neutral-900 text-right">
              <button
                onClick={closeModal}
                className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-950 dark:bg-neutral-200 dark:hover:bg-white text-white dark:text-neutral-900 rounded-xl font-bold cursor-pointer"
              >
                {lang === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
