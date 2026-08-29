import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Priority: Saved choice -> System preference -> Default light
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark'); // Add standard tailwind dark support just in case
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      id="theme-toggle"
      className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-center relative overflow-hidden"
      aria-label="Toggle visual theme"
    >
      {/* 
        PDF Rule page 62: "L'icône représente toujours le mode opposé (ce vers quoi on bascule)."
        - If current theme is light, show Moon (🌙) so the user knows clicking goes to dark mode.
        - If current theme is dark, show Sun (☀️) so the user knows clicking goes to light mode.
      */}
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-neutral-700 animate-slide-in-up" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400 animate-slide-in-down" />
      )}
    </button>
  );
}
