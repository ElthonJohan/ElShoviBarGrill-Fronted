import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tarjeta-component',
  standalone: true,
  templateUrl: './tarjeta-component.html',
  styleUrl: './tarjeta-component.css',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, // para <mat-form-field>
    MatInputModule,     // para matInput
    MatButtonModule
  ]
})
export class TarjetaComponent {

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  // Variables que deberías reemplazar con las reales de tu app
  idUsuario = 1;
  idMesa = null;
  total = 50.0;
  itemsCarrito = [
    { idMenuItem: 1, quantity: 2, unitPrice: 15 },
    { idMenuItem: 3, quantity: 1, unitPrice: 20 }
  ];

  model = {
    nombre: '',
    numero: '',
    mes: '',
    anio: '',
    cvv: ''
  };

  guardar() {
  if (!this.idUsuario) {
    console.error("No se encontró el usuario. Debes iniciar sesión.");
    return;
  }

  if (!this.itemsCarrito || this.itemsCarrito.length === 0) {
    console.error("No hay items en el carrito.");
    return;
  }

  const nuevaOrden = {
    idUser: this.idUsuario,
    idTable: 1, // DELIVERY → sin mesa
    orderType: "DELIVERY",   // ✔ correcto
    status: "PENDIENTE",     // ✔ coincide con backend
    totalAmount: this.itemsCarrito.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0),
    notes: "",
    items: this.itemsCarrito.map(i => ({
      idMenuItem: 1,
      quantity: i.quantity,
      unitPrice: i.unitPrice
    })),
    idPayment: null
  };

  console.log("DTO a enviar:", nuevaOrden);

  this.orderService.createOrder(nuevaOrden).subscribe({
    next: (res) => {
      console.log("Orden creada correctamente:", res);
      this.router.navigate(['/order']);
      
    },
    error: (err) => console.error("Error al crear orden:", err)
  });
  this.router.navigate(['/home']);

}




}
