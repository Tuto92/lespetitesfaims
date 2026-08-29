import { Language } from '../types';

interface LanguageToggleProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageToggle({ currentLang, onLanguageChange }: LanguageToggleProps) {
  return (
    <button
      onClick={() => onLanguageChange(currentLang === 'fr' ? 'en' : 'fr')}
      id="language-toggle"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
      aria-label="Toggle language"
    >
      <span className="text-sm">
        {currentLang === 'fr' ? '🇫🇷' : '🇬🇧'}
      </span>
      <span className="font-mono tracking-wider">
        {currentLang === 'fr' ? 'FR' : 'EN'}
      </span>
    </button>
  );
}
