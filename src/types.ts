export type Language = 'fr' | 'en';

export type Allergen = 'gluten' | 'lait' | 'oeuf' | 'fruits_coque' | 'arachides' | 'sulfites';

export interface AllergenInfo {
  code: Allergen;
  labelFr: string;
  labelEn: string;
  icon: string;
}

export interface MenuItem {
  id: string;
  nameFr: string;
  nameEn: string;
  descFr: string;
  descEn: string;
  price: number;
  category: 'entree' | 'plat' | 'dessert' | 'boisson';
  allergens: Allergen[];
  isSignature?: boolean;
  isVeg?: boolean;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  textFr: string;
  textEn: string;
  date: string;
  isVerified: boolean;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface OpeningHour {
  day: string;
  dayEn: string;
  hours: string;
  closed: boolean;
}
