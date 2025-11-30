import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'elshovi_cart_v1';
  private _items = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  readonly items$ = this._items.asObservable();

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      return JSON.parse(raw) as CartItem[];
    } catch (e) {
      console.error('Error loading cart from storage', e);
      return [];
    }
  }

  private saveToStorage(items: CartItem[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to storage', e);
    }
  }

  getItems(): CartItem[] {
    return this._items.getValue();
  }

  addItem(item: CartItem) {
    const items = this.getItems();
    const existing = items.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push({ ...item });
    }
    this._items.next(items);
    this.saveToStorage(items);
  }

  updateQuantity(id: number | string, quantity: number) {
    const items = this.getItems();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    if (quantity <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx].quantity = quantity;
    }
    this._items.next(items);
    this.saveToStorage(items);
  }

  clear() {
    this._items.next([]);
    this.saveToStorage([]);
  }

  remove(id: number | string) {
    const items = this.getItems().filter(i => i.id !== id);
    this._items.next(items);
    this.saveToStorage(items);
  }
}
