import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './cart-widget.component.html',
  styleUrls: ['./cart-widget.component.css']
})
export class CartWidgetComponent {
  items: CartItem[] = [];
  open = false;

  constructor(private cartService: CartService, private router: Router) {
    this.cartService.items$.subscribe(it => this.items = it || []);
  }

  get totalCount(): number {
    return this.items.reduce((s, i) => s + (i.quantity || 0), 0);
  }

  get totalAmount(): number {
    return this.items.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 0)), 0);
  }

  toggle() { this.open = !this.open; }

  increase(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decrease(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity - 1);
  }

  remove(item: CartItem) {
    this.cartService.remove(item.id);
  }

  clear() { this.cartService.clear(); }

  checkout() {
    const total = this.totalAmount;
    try {
      const payload = { total, items: this.items };
      localStorage.setItem('elshovi_checkout_payload', JSON.stringify(payload));
    } catch (e) {
      console.error('Could not store checkout payload', e);
    }
    this.open = false; // cerrar panel
    // navegar a pedidos
    this.router.navigate(['/pages/tarjeta-component']);
  }

}
