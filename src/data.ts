import { MenuItem, AllergenInfo, OpeningHour, Review } from './types';

export const ALLERGENS: AllergenInfo[] = [
  { code: 'gluten', labelFr: 'Gluten', labelEn: 'Gluten', icon: '🌾' },
  { code: 'lait', labelFr: 'Lait/Lactose', labelEn: 'Dairy/Lactose', icon: '🥛' },
  { code: 'oeuf', labelFr: 'Œufs', labelEn: 'Eggs', icon: '🥚' },
  { code: 'fruits_coque', labelFr: 'Fruits à coque', labelEn: 'Nuts', icon: '🥜' },
  { code: 'arachides', labelFr: 'Arachides', labelEn: 'Peanuts', icon: '🥜' },
  { code: 'sulfites', labelFr: 'Sulfites', labelEn: 'Sulfites', icon: '🍷' }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'entree_1',
    nameFr: 'Œuf Parfait Croustillant',
    nameEn: 'Crispy Slow-Cooked Egg',
    descFr: 'Œuf mollet en chapelure dorée, émulsion de parmesan bio et herbes fraîches.',
    descEn: 'Soft-boiled egg in a golden crust, organic parmesan emulsion, and fresh herbs.',
    price: 9.00,
    category: 'entree',
    allergens: ['gluten', 'lait', 'oeuf'],
    isSignature: true
  },
  {
    id: 'entree_2',
    nameFr: 'Velouté Crémeux de Saison',
    nameEn: 'Creamy Seasonal Soup',
    descFr: 'Potimarron rôti, noisettes torréfiées du Piémont et filet d’huile de truffe.',
    descEn: 'Roasted pumpkin soup, Piedmont toasted hazelnuts, and a drizzle of truffle oil.',
    price: 8.00,
    category: 'entree',
    allergens: ['fruits_coque', 'lait'],
    isVeg: true
  },
  {
    id: 'entree_3',
    nameFr: 'Tartine de Chèvre Chaud',
    nameEn: 'Warm Goat Cheese Toast',
    descFr: 'Fromage de chèvre frais de producteurs locaux, miel de Clamart et thym sauvage.',
    descEn: 'Fresh local goat cheese, Clamart organic honey, and wild thyme.',
    price: 9.00,
    category: 'entree',
    allergens: ['gluten', 'lait'],
    isVeg: true
  },
  {
    id: 'plat_1',
    nameFr: 'Steak Frites de Bistrot',
    nameEn: 'Classic Steak Frites',
    descFr: 'Pièce de bœuf tendre, sauce béarnaise maison, frites fraîches coupées à la main.',
    descEn: 'Tender beef cut, homemade bearnaise sauce, fresh hand-cut french fries.',
    price: 21.00,
    category: 'plat',
    allergens: ['oeuf', 'lait'],
    isSignature: true
  },
  {
    id: 'plat_2',
    nameFr: 'Filet de Bar Poêlé',
    nameEn: 'Pan-Seared Sea Bass',
    descFr: 'Bar cuit sur peau, risotto crémeux infusé au safran et asperges vertes croquantes.',
    descEn: 'Sea bass seared on skin, creamy saffron-infused risotto, and crisp green asparagus.',
    price: 24.00,
    category: 'plat',
    allergens: ['lait', 'sulfites']
  },
  {
    id: 'plat_3',
    nameFr: 'Joue de Bœuf Bourguignonne',
    nameEn: 'Beef Cheek Bourguignon',
    descFr: 'Joue mijotée pendant 8h au vin de Bourgogne, carottes glacées et oignons grelots.',
    descEn: 'Beef cheek slow-braised for 8 hours in red Burgundy wine, glazed carrots, and pearl onions.',
    price: 22.00,
    category: 'plat',
    allergens: ['sulfites']
  },
  {
    id: 'plat_4',
    nameFr: 'Gnocchis aux Champignons Sylvestres',
    nameEn: 'Wild Mushroom Gnocchi',
    descFr: 'Gnocchis de pommes de terre sautés, crème de girolles et truffe d’été rapée.',
    descEn: 'Pan-fried potato gnocchi, chanterelle mushroom cream, and shaved summer truffle.',
    price: 19.00,
    category: 'plat',
    allergens: ['gluten', 'lait'],
    isVeg: true
  },
  {
    id: 'dessert_1',
    nameFr: 'Cœur Coulant au Chocolat Noir',
    nameEn: 'Warm Dark Chocolate Lava Cake',
    descFr: 'Cacao 70%, glace à la gousse de vanille Bourbon de Madagascar et brisures de sablé.',
    descEn: '70% dark cocoa, Madagascar Bourbon vanilla bean ice cream, and shortbread crumbles.',
    price: 8.00,
    category: 'dessert',
    allergens: ['gluten', 'lait', 'oeuf']
  },
  {
    id: 'dessert_2',
    nameFr: 'Tarte Tatin Légendaire',
    nameEn: 'Legendary Tarte Tatin',
    descFr: 'Pommes caramélisées fondantes, pâte feuilletée croustillante, crème fraîche épaisse d’Isigny.',
    descEn: 'Caramelized apples, flaky puff pastry, and thick Isigny fresh cream.',
    price: 9.00,
    category: 'dessert',
    allergens: ['gluten', 'lait', 'oeuf'],
    isSignature: true
  },
  {
    id: 'dessert_3',
    nameFr: 'Pain Perdu Gourmand',
    nameEn: 'Gourmet French Toast',
    descFr: 'Brioche artisanale dorée, caramel au beurre salé maison et amandes effilées grillées.',
    descEn: 'Golden artisan brioche, homemade salted caramel, and toasted sliced almonds.',
    price: 8.00,
    category: 'dessert',
    allergens: ['gluten', 'lait', 'oeuf', 'fruits_coque']
  },
  {
    id: 'boisson_1',
    nameFr: 'Verre de Bordeaux AOC - L’Essentiel',
    nameEn: 'Bordeaux AOC Red Wine',
    descFr: 'Vin rouge rond et charnu, notes de fruits noirs et d’épices.',
    descEn: 'Full-bodied red wine, hints of dark berries and soft oak spices.',
    price: 6.00,
    category: 'boisson',
    allergens: ['sulfites']
  },
  {
    id: 'boisson_2',
    nameFr: 'Cidre Artisanal de Normandie',
    nameEn: 'Normandy Artisan Cider',
    descFr: 'Cidre demi-sec fruité et rafraîchissant issu de pommes biologiques.',
    descEn: 'Medium-dry cider, fruity and crisp, made from organic apples.',
    price: 5.00,
    category: 'boisson',
    allergens: ['sulfites']
  },
  {
    id: 'boisson_3',
    nameFr: 'Limonade Artisanale Bio',
    nameEn: 'Organic Craft Lemonade',
    descFr: 'Limonade fraîche pressée maison, sucre de canne bio et zeste de citron jaune.',
    descEn: 'Fresh hand-pressed craft lemonade, organic cane sugar, and lemon zest.',
    price: 4.50,
    category: 'boisson',
    allergens: []
  },
  {
    id: 'boisson_4',
    nameFr: 'Expresso des Allobroges',
    nameEn: 'Organic Expresso Coffee',
    descFr: 'Café de torréfaction lente et artisanale, arômes chocolatés persistants.',
    descEn: 'Slow roasted organic artisan coffee, rich chocolatey notes.',
    price: 2.50,
    category: 'boisson',
    allergens: []
  }
];

export const OPENING_HOURS: OpeningHour[] = [
  { day: 'Lundi', dayEn: 'Monday', hours: 'Fermé', closed: true },
  { day: 'Mardi', dayEn: 'Tuesday', hours: '12h00 - 14h30, 19h00 - 20h00', closed: false },
  { day: 'Mercredi', dayEn: 'Wednesday', hours: '12h00 - 14h30, 19h00 - 20h00', closed: false },
  { day: 'Jeudi', dayEn: 'Thursday', hours: '12h00 - 14h30, 19h00 - 20h00', closed: false },
  { day: 'Vendredi', dayEn: 'Friday', hours: '12h00 - 14h30, 19h00 - 20h00', closed: false },
  { day: 'Samedi', dayEn: 'Saturday', hours: '12h00 - 15h00, 19h00 - 20h00', closed: false },
  { day: 'Dimanche', dayEn: 'Sunday', hours: 'Fermé', closed: true }
];

export const GOOGLE_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    name: 'Jean-Luc M.',
    rating: 5,
    textFr: 'Une trouvaille merveilleuse à Clamart ! L’œuf parfait est absolument divin, et l’accueil du gérant est chaleureux. Très bon rapport qualité-prix.',
    textEn: 'A wonderful find in Clamart! The crispy slow-cooked egg is absolutely divine, and the manager is so welcoming. Very good value for money.',
    date: 'Il y a 2 semaines',
    isVerified: true
  },
  {
    id: 'rev_2',
    name: 'Sophie L.',
    rating: 4,
    textFr: 'Excellente brasserie traditionnelle ! Le steak frites et la tarte tatin sont à tomber. Pensez à réserver, la salle se remplit vite le midi.',
    textEn: 'Excellent traditional brasserie! The steak frites and tarte tatin are to die for. Remember to book, it gets very busy at lunchtime.',
    date: 'Il y a 1 mois',
    isVerified: true
  },
  {
    id: 'rev_3',
    name: 'Thomas V.',
    rating: 5,
    textFr: 'Nous y avons fêté un repas d’affaires. Le service est rapide et extrêmement poli. La conformité et l’hygiène sont irréprochables.',
    textEn: 'We had a business dinner here. The service is fast and extremely polite. The compliance and hygiene standards are flawless.',
    date: 'Il y a 3 semaines',
    isVerified: true
  },
  {
    id: 'rev_4',
    name: 'Clara D.',
    rating: 5,
    textFr: 'Gros coup de cœur pour les gnocchis aux champignons ! Une cuisine authentique, saine, loin du surgelé industriel. Je recommande les yeux fermés !',
    textEn: 'A huge favorite of mine is the mushroom gnocchi! Authentic, healthy food, far from industrial frozen options. I highly recommend!',
    date: 'Il y a 4 jours',
    isVerified: true
  }
];
