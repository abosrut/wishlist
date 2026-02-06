export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  url?: string;
  image?: string;
  description?: string;
  desiredDate?: string;
  status: 'planned' | 'purchased' | 'postponed';
  createdAt: string;
  updatedAt: string;
}

export type SortField = 'price' | 'desiredDate' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  status?: WishlistItem['status'][];
  minPrice?: number;
  maxPrice?: number;
  dateFrom?: string;
  dateTo?: string;
}
