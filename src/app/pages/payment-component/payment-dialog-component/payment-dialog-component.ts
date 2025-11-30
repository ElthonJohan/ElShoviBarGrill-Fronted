import { Component, Inject } from '@angular/core';
import { Payment } from '../../../model/payment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from '../../../services/payment-service';
import { finalize, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OrderService } from '../../../services/order-service';

@Component({
  selector: 'app-payment-dialog-component',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './payment-dialog-component.html',
  styleUrl: './payment-dialog-component.css',
})
export class PaymentDialogComponent {
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService,
    private dialogRef: MatDialogRef<PaymentDialogComponent>
  ) {}

  paymentMethod = "";

  pagar() {
     if (!this.paymentMethod) {
    alert("Selecciona un método de pago");
    return;
  }

  this.orderService.payOrder(this.data.idOrder, this.paymentMethod)
    .pipe(
      finalize(() => {
        this.dialogRef.close(true);  // 👈 SIEMPRE CERRAR
      })
    )
    .subscribe({
      next: (res) => {
        alert("Pago registrado correctamente");
      },
      error: err => {
        console.error(err);
        alert("Error al registrar el pago");
      }
    });
  }

}
