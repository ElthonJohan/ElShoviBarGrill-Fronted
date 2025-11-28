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
import { OrderStatus } from '../../../model/enums/orderstatus';
import { MatSnackBar } from '@angular/material/snack-bar';

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
   form!: FormGroup;
  isEdit = false;

  users: User[] = [];
  tables: Table[] = [];

  estatus=OrderStatus

  statuss = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'CANCELADA', label: 'Cancelada' },
    { value: 'INACTIVO', label: 'Inactivo' },
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Order,
    private _dialogRef: MatDialogRef<OrderDialogComponent>,
    private orderService: OrderService,
    private userService: UserService,
    private tableService: TableService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
        this.isEdit = !!this.data;

    
    this.form = this.fb.group({
      user: [this.data?.idUser || null, Validators.required],
    table: [this.data?.idTable || null],
    payment: [this.data?.idPayment || null],

    orderType: [this.data?.orderType || null, Validators.required],
    status: [this.data?.status || null, Validators.required],
    totalAmount: [this.data?.totalAmount || null],
    notes: [this.data?.notes || null],
    createdAt: [this.data?.createdAt || null],
    items: [this.data?.items || null, Validators.required],
    });
      this.loadUsers();
  this.loadTables();
  }
  loadUsers() {
    // Aquí llamas a tu userService
    // Cargar usuarios
    this.userService.findAll().subscribe((cats: User[]) => {
      this.users = cats;
    });
  }

  loadTables() {
    // Aquí llamas a tableService
    this.tableService.findAll().subscribe((cats: Table[]) => {
      this.tables = cats;
    });
  }
  close(){
    this._dialogRef.close();
  }

    handleError(err: any) {
  const message = err?.error || 'Error inesperado';

  this.snackBar.open(
    message,
    'Cerrar',
    {
      duration: 4000,
      panelClass: ['snackbar-error']
    }
  );
}


  operate(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // merge form values into table object
    const form = this.form.value;
    
    const payload: Order = {
      ...this.data,
      idUser: form.user,
      idTable: form.table,
      idPayment: form.idPayment,

      totalAmount: form.totalAmount,
      orderType: form.orderType,
      notes: form.notes ? form.notes : '',
      status: form.status,
      createdAt: form.createdAt,
      items: form.items
    };

    if (payload != null && payload.idOrder > 0 ) {
      // UPDATE
      this.orderService.update(payload.idOrder, payload)
        .pipe(switchMap(() => this.orderService.findAll()))
        .subscribe({
      next: (data) => {
        this.orderService.setModelChange(data);
        this.orderService.setMessageChange('ORDEN ACTUALIZADA');
        this._dialogRef.close(payload);
      },
      error: (err) => this.handleError(err)
    });
    } else {
      // INSERT
      this.orderService.save(payload)
        .pipe(switchMap(() => this.orderService.findAll()))
        .subscribe({
      next: (data) => {
        this.orderService.setModelChange(data);
        this.orderService.setMessageChange('ORDEN CREADA');
        this._dialogRef.close(payload);
      },
      error: (err) => this.handleError(err)
    });
    }

  }
}
