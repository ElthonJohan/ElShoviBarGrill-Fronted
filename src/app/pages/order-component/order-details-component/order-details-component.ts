import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order-service';
import { MenuItemService } from '../../../services/menu-item-service';
import { MatDivider } from "@angular/material/divider";
import { MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-order-details-component',
  imports: [MatDivider, MatCard, NgClass, MatIcon,CommonModule],
  templateUrl: './order-details-component.html',
  styleUrl: './order-details-component.css',
})
export class OrderDetailsComponent {
  
  order: any = null;
  items: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private menuService: MenuItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.orderService.findById(id).subscribe(order => {
      this.order = order;

      // cargar items con info de menú
      this.items = [];
      order.items.forEach((it: any) => {
        this.menuService.findById(it.idMenuItem).subscribe(menu => {
          this.items.push({
            ...it,
            name: menu.name,
            imageUrl: menu.imageUrl
          });
        });
      });
    });
  }

  volver() {
    this.router.navigate(['/pages/orderregister']);
  }

}
