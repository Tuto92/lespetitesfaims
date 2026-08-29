import { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, Leaf, Heart } from 'lucide-react';
import { MenuItem, Language, Allergen } from '../types';
import { MENU_ITEMS, ALLERGENS } from '../data';

interface InteractiveMenuProps {
  lang: Language;
  onAddToCart: (item: MenuItem) => void;
  cartQuantities: { [key: string]: number };
}

export default function InteractiveMenu({ lang, onAddToCart, cartQuantities }: InteractiveMenuProps) {
  const [activeCategory, setActiveCategory] = useState<'tous' | 'entree' | 'plat' | 'dessert' | 'boisson'>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAllergenFilter, setSelectedAllergenFilter] = useState<Allergen | 'aucun'>('tous' as any === 'aucun' ? 'aucun' : 'aucun');
  const [onlyVeg, setOnlyVeg] = useState(false);

  // Group items or filter
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      // Category filter
      if (activeCategory !== 'tous' && item.category !== activeCategory) {
        return false;
      }
      // Vegetarian filter
      if (onlyVeg && !item.isVeg) {
        return false;
      }
      // Allergen filter (exclude items that contain the selected allergen)
      if (selectedAllergenFilter !== 'aucun' && item.allergens.includes(selectedAllergenFilter)) {
        return false;
      }
      // Search query
      const name = lang === 'fr' ? item.nameFr.toLowerCase() : item.nameEn.toLowerCase();
      const desc = lang === 'fr' ? item.descFr.toLowerCase() : item.descEn.toLowerCase();
      const matchSearch = name.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
      
      return matchSearch;
    });
  }, [activeCategory, searchQuery, selectedAllergenFilter, onlyVeg, lang]);

  return (
    <section id="menu-digital" className="py-12 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3 h-3" />
            <span>{lang === 'fr' ? 'Fait Maison & Local' : '100% Homemade & Local'}</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-neutral-900 dark:text-white tracking-tight sm:text-4xl animate-letter-spacing">
            {lang === 'fr' ? 'Notre Ardoise Numérique' : 'Our Digital Menu'}
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            {lang === 'fr'
              ? 'Consultez nos plats frais élaborés chaque matin par notre chef. Des produits locaux issus de circuits courts à Clamart et ses environs.'
              : 'Explore our fresh dishes crafted daily by our chef. Local ingredients sourced from sustainable circuits in Clamart and Ile-de-France.'}
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 mb-10 shadow-sm animate-slide-in-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'fr' ? 'Rechercher un plat, ingrédient...' : 'Search for a dish, ingredient...'}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-neutral-950 transition-all"
              />
            </div>

            {/* Allergen Excluder */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
              <select
                value={selectedAllergenFilter}
                onChange={(e) => setSelectedAllergenFilter(e.target.value as any)}
                className="w-full py-2 px-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                title={lang === 'fr' ? 'Exclure un allergène' : 'Exclude an allergen'}
              >
                <option value="aucun">{lang === 'fr' ? 'Sans restriction' : 'No restriction'}</option>
                {ALLERGENS.map(all => (
                  <option key={all.code} value={all.code}>
                    {lang === 'fr' ? `Exclure : ${all.labelFr}` : `Exclude: ${all.labelEn}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Vegetarian Switch */}
            <div className="flex items-center justify-end">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700 dark:text-neutral-300">
                <input
                  type="checkbox"
                  checked={onlyVeg}
                  onChange={(e) => setOnlyVeg(e.target.checked)}
                  className="rounded text-green-600 focus:ring-green-500 w-4 h-4 accent-green-600 cursor-pointer"
                />
                <Leaf className="w-3.5 h-3.5 text-green-500" />
                <span>{lang === 'fr' ? 'Options Végétariennes' : 'Vegetarian Only'}</span>
              </label>
            </div>

          </div>

          {/* Categories Tab Selector */}
          <div className="flex flex-wrap gap-2 mt-5 border-t border-neutral-100 dark:border-neutral-900 pt-4">
            {(['tous', 'entree', 'plat', 'dessert', 'boisson'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {cat === 'tous' && (lang === 'fr' ? 'Tout voir' : 'All Items')}
                {cat === 'entree' && (lang === 'fr' ? '🥗 Entrées' : '🥗 Starters')}
                {cat === 'plat' && (lang === 'fr' ? '🥩 Plats' : '🥩 Main Courses')}
                {cat === 'dessert' && (lang === 'fr' ? '🍰 Desserts' : '🍰 Desserts')}
                {cat === 'boisson' && (lang === 'fr' ? '🍷 Boissons' : '🍷 Drinks')}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid - Desktop 3 cols, Tablet 2 cols, Mobile 1 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map(item => {
            const qtyInCart = cartQuantities[item.id] || 0;
            return (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                id={`menu-item-${item.id}`}
              >
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tags line */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
                        {lang === 'fr' ? item.category : item.category === 'entree' ? 'starter' : item.category === 'plat' ? 'main' : item.category}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        {item.isSignature && (
                          <span className="inline-flex items-center gap-0.5 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                            <Heart className="w-2.5 h-2.5 fill-current" />
                            {lang === 'fr' ? 'Signature' : 'Chef Favorite'}
                          </span>
                        )}
                        {item.isVeg && (
                          <span className="inline-flex items-center gap-0.5 bg-green-500/10 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                            <Leaf className="w-2.5 h-2.5" />
                            {lang === 'fr' ? 'Végé' : 'Veggie'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Item Name */}
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {lang === 'fr' ? item.nameFr : item.nameEn}
                    </h3>

                    {/* Item Description (max 3 sentences) */}
                    <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed min-h-[40px]">
                      {lang === 'fr' ? item.descFr : item.descEn}
                    </p>
                  </div>

                  {/* Allergen Badges */}
                  {item.allergens.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.allergens.map(allCode => {
                        const allInfo = ALLERGENS.find(a => a.code === allCode);
                        return (
                          <span
                            key={allCode}
                            className="inline-flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full cursor-help"
                            title={lang === 'fr' ? allInfo?.labelFr : allInfo?.labelEn}
                          >
                            <span>{allInfo?.icon}</span>
                            <span>{lang === 'fr' ? allInfo?.labelFr : allInfo?.labelEn}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom line: Price & CTA */}
                <div className="px-5 py-4 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
                  <span className="text-lg font-mono font-bold text-neutral-900 dark:text-white">
                    {item.price.toFixed(2)} €
                  </span>

                  <button
                    onClick={() => onAddToCart(item)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1"
                    aria-label={`Add ${lang === 'fr' ? item.nameFr : item.nameEn} to cart`}
                  >
                    <span>{lang === 'fr' ? 'Ajouter' : 'Add'}</span>
                    {qtyInCart > 0 && (
                      <span className="bg-white text-blue-600 font-mono w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ml-1 animate-scale-up">
                        {qtyInCart}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                {lang === 'fr'
                  ? 'Aucun plat ne correspond à vos critères de recherche ou de restriction.'
                  : 'No dishes match your search or allergen restrictions.'}
              </p>
            </div>
          )}
        </div>

        {/* INCO Allergen Glossary - Obligation légale en France, page 4 */}
        <div className="bg-neutral-100 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 text-[11px] text-neutral-500 dark:text-neutral-400">
          <p className="font-semibold text-neutral-700 dark:text-neutral-300 mb-2 uppercase tracking-wider font-mono">
            {lang === 'fr' ? '⚠️ Réglementation INCO - Déclaration des Allergènes :' : '⚠️ INCO Regulation - Allergen Disclosures:'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {ALLERGENS.map(all => (
              <div key={all.code} className="flex items-center gap-1">
                <span>{all.icon}</span>
                <span className="font-medium text-neutral-600 dark:text-neutral-400">
                  {lang === 'fr' ? all.labelFr : all.labelEn}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 leading-relaxed border-t border-neutral-200 dark:border-neutral-800 pt-2 text-[10px]">
            {lang === 'fr'
              ? '* Les plats de notre carte peuvent contenir des traces d’autres allergènes en raison de leur confection dans notre cuisine artisanale. Veuillez le signaler à notre équipe lors de votre commande.'
              : '* Our dishes may contain traces of other allergens as they are crafted in our artisanal kitchen. Please inform our staff when ordering.'}
          </p>
        </div>

      </div>
    </section>
  );
}
