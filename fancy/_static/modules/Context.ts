import { User } from 'ftypes';

export interface AppContext {
  loggedIn: boolean;
  viewer: User;
  lastFullyRenderedThingID: number;
  applePayDisplay: boolean;
}

export interface FollowContext {}

export interface FancyContext {
    id?: null | number;
    fancyd_count?: number;
    fancyd?: boolean;
    loading?: boolean;
    status?: 'Idle' | 'Addition' | 'Removal' | 'After';
}

export interface SlideContext {
    thumbnailIndex: number;
}

export interface SaleContext {
    saleOptionID?: number | null;
    currencyCode?: string;
    price?: number;
    currencySymbol?: string;
    currencyMoney?: string | null;
    selectedQuantity?: number;
    personalization?: string;
    waiting?: boolean;
}
