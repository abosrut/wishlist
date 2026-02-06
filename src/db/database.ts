import Dexie, { Table } from 'dexie';
import { WishlistItem } from '../types/wishlist';

export class WishlistDatabase extends Dexie {
  items!: Table<WishlistItem, string>;

  constructor() {
    super('WishlistDB');
    this.version(1).stores({
      items: 'id, title, price, desiredDate, status, createdAt'
    });
  }
}

export const db = new WishlistDatabase();
