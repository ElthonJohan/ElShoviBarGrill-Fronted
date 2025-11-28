import { Component, Inject } from '@angular/core';
import { Payment } from '../../../model/payment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from '../../../services/payment-service';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
  payment: Payment;
  form!: FormGroup;
  statuses = [
      { value: 'FINALIZADO', label: 'Finalizado' },
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'RECHAZADO', label: 'Rechazado' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Payment,
    private _dialogRef: MatDialogRef<PaymentDialogComponent>,
    private paymentService: PaymentService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.payment = { ...this.data };
    
    
    this.form = this.fb.group({
      name: this.fb.control(this.payment.amount ?? ''),
      paymentDate: this.fb.control(this.payment.paymentDate ?? '', [Validators.required]),
      paymentMethod: this.fb.control(this.payment.paymentMethod ?? false, [Validators.required]),
      status: this.fb.control(this.payment.status ?? '', [Validators.required]),
    });
  }

  /** Async validator: checks backend for existing tableNumber and ignores current table id */

  close(){
    this._dialogRef.close();
  }



  operate(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // merge form values into table object
    const formVal = this.form.value;
    const payload: Payment = {
      ...this.payment,
      amount: formVal.name,
      paymentDate: formVal.paymentDate,
      status: formVal.status,
      paymentMethod: formVal.paymentMethod,
    };

    if (payload != null && payload.idPayment > 0 ) {
      // UPDATE
      this.paymentService.update(payload.idPayment, payload)
        .pipe(switchMap(() => this.paymentService.findAll()))
        .subscribe(data => {
          this.paymentService.setModelChange(data);
          this.paymentService.setMessageChange('UPDATED!');
        });
    } else {
      // INSERT
      this.paymentService.save(payload)
        .pipe(switchMap(() => this.paymentService.findAll()))
        .subscribe(data => {
          this.paymentService.setModelChange(data);
          this.paymentService.setMessageChange('CREATED!');
        });
    }

    this.close();
  }

}
