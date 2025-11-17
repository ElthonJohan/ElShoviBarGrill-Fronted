import { Component, Inject } from '@angular/core';
import { Order } from '../../../model/order';
import { User } from '../../../model/user';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Table } from '../../../model/table';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from '../../../services/order-service';
import { UserService } from '../../../services/user-service';
import { TableService } from '../../../services/table-service';
import { OrderType } from '../../../model/enums/ordertype';
import { map, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-order-dialog-component',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './order-dialog-component.html',
  styleUrl: './order-dialog-component.css',
})
export class OrderDialogComponent {
   order: Order;
  users: User[];
  tables: Table[];
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Order,
    private _dialogRef: MatDialogRef<OrderDialogComponent>,
    private orderService: OrderService,
    private userService: UserService,
    private tableService: TableService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.order = { ...this.data };
    this.users = [];
    this.tables = [];

    
    // Cargar usuarios
    this.userService.findAll().subscribe(
      (cats: User[]) => {
        this.users = cats;
      }
    );

    // Cargar usuarios
    this.tableService.findAll().subscribe(
      (cats: Table[]) => {
        this.tables = cats;
      }
    );
    
    this.form = this.fb.group({
      idUser: this.fb.control(this.order.idUser ?? ''),
      idTable: this.fb.control(this.order.idTable ?? ''),
      idPayment: this.fb.control(this.order.idPayment ?? ''),

      totalAmount: this.fb.control(this.order.totalAmount ?? '', [Validators.required]),
      status: this.fb.control(this.order.status ?? false, [Validators.required]),
      orderType: this.fb.control(this.order.orderType ?? '', [Validators.required]),
      notes: this.fb.control(this.order.notes ?? ''),
      createdAt: this.fb.control(this.order.createdAt ?? '', [Validators.required]),
      items: this.fb.control(this.order.items ?? '', [Validators.required]),

    });
  }

  /** Async validator: checks backend for existing tableNumber and ignores current table id */
  // menuNameUniqueValidator() {
  //   return (control: AbstractControl) => {
  //     const value = control.value;
  //     if (value == null || value === '') {
  //       return of(null);
  //     }
  //     return this.orderService.findAll().pipe(
  //       map((orders: Order[]) => {
  //         const exists = orders.some(t => t.name == value && t.idorder !== this.order?.idorder);
  //         return exists ? { menuNameExists: true } : null;
  //       }),
  //       catchError(() => of(null))
  //     );
  //   };
  // }

  close(){
    this._dialogRef.close();
  }

  // compareBoolean(b1: boolean, b2: boolean): boolean {
  //   return b1 === b2;
  // }

  operate(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // merge form values into table object
    const formVal = this.form.value;
    const payload: Order = {
      ...this.order,
      idUser: formVal.idUser,
      idTable: formVal.idTable,
      idPayment: formVal.idPayment,

      totalAmount: formVal.totalAmount,
      orderType: formVal.orderType,
      notes: formVal.notes ? formVal.notes : '',
      status: formVal.status,
      createdAt: formVal.createdAt,
      items: formVal.items
    };

    if (payload != null && payload.idOrder > 0 ) {
      // UPDATE
      this.orderService.update(payload.idOrder, payload)
        .pipe(switchMap(() => this.orderService.findAll()))
        .subscribe(data => {
          this.orderService.setModelChange(data);
          this.orderService.setMessageChange('UPDATED!');
        });
    } else {
      // INSERT
      this.orderService.save(payload)
        .pipe(switchMap(() => this.orderService.findAll()))
        .subscribe(data => {
          this.orderService.setModelChange(data);
          this.orderService.setMessageChange('CREATED!');
        });
    }

    this.close();
  }
}
