import { Component, Inject } from '@angular/core';
import { Reservation } from '../../../model/reservation';
import { Table } from '../../../model/table';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ReservationService } from '../../../services/reservation-service';
import { TableService } from '../../../services/table-service';
import { User } from '../../../model/user';
import { UserService } from '../../../services/user-service';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepickerInput,
  MatDatepicker,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { timeRangeValidator } from '../../../validators/time-range.validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservation-dialog-component',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerInput,
    MatDatepicker,
    MatDatepickerToggle,
  ],
  templateUrl: './reservation-dialog-component.html',
  styleUrl: './reservation-dialog-component.css',
})
export class ReservationDialogComponent {
  form!: FormGroup;
  isEdit = false;

  users: User[] = [];
  tables: Table[] = [];

  statuss = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'CANCELADA', label: 'Cancelada' },
    { value: 'INACTIVO', label: 'Inactivo' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Reservation,
    private _dialogRef: MatDialogRef<ReservationDialogComponent>,
    private reservationService: ReservationService,
    private tableService: TableService,
    private userService: UserService,
    private fb: FormBuilder,
      private snackBar: MatSnackBar

  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;

    // ====== Preparar valores iniciales de fecha y horas ======
    let startDate: Date | null = null;
  // Convertir horas si vienen con segundos
  const startTime = this.data?.reservationTimeStart
    ? this.data.reservationTimeStart.substring(0, 5)
    : '';

  const endTime = this.data?.reservationTimeEnd
    ? this.data.reservationTimeEnd.substring(0, 5)
    : '';

    this.form = this.fb.group({
    user: [this.data?.idUser || null, Validators.required],
    table: [this.data?.idTable || null, Validators.required],

    reservationDate: [
      this.data?.reservationDate ? new Date(this.data.reservationDate) : null,
      Validators.required
    ],

    reservationTimeStart: [
      startTime,
      [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]
    ],

    reservationTimeEnd: [
      endTime,
      [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]
    ],

    status: [this.data?.status || 'PENDIENTE', Validators.required]
  },{
    Validators:timeRangeValidator
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
  /** Async validator: checks backend for existing tableNumber and ignores current table id */

  close() {
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


  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const form = this.form.value;

    const startTimeStr: string = form.reservationTimeStart;
    const endTimeStr: string = form.reservationTimeEnd;

    // Fecha → LocalDate (YYYY-MM-DD)
    const dateISO = form.reservationDate.toISOString().split('T')[0];

    const payload: Reservation = {
      ...this.data,
      idUser: form.user,
      idTable: form.table,
      reservationDate: dateISO,
      reservationTimeStart: startTimeStr,
      reservationTimeEnd: endTimeStr,
      status: form.status,
    };

    console.log('Payload enviado:', payload);
// UPDATE
if (payload.idReservation && payload.idReservation > 0) {
  this.reservationService
    .update(payload.idReservation, payload)
    .pipe(switchMap(() => this.reservationService.findAll()))
    .subscribe({
      next: (data) => {
        this.reservationService.setModelChange(data);
        this.reservationService.setMessageChange('RESERVA ACTUALIZADA');
        this._dialogRef.close(payload);
      },
      error: (err) => this.handleError(err)
    });
} 
else {
  // INSERT
  this.reservationService
    .save(payload)
    .pipe(switchMap(() => this.reservationService.findAll()))
    .subscribe({
      next: (data) => {
        this.reservationService.setModelChange(data);
        this.reservationService.setMessageChange('RESERVA CREADA');
        this._dialogRef.close(payload);
      },
      error: (err) => this.handleError(err)
    });
}

  }
}
// idTable: formVal.idTable,
// idUser: formVal.idUser ,
