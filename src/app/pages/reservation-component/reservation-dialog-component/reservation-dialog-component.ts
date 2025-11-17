import { Component, Inject } from '@angular/core';
import { Reservation } from '../../../model/reservation';
import { Table } from '../../../model/table';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
    MatButtonModule
  ],
  templateUrl: './reservation-dialog-component.html',
  styleUrl: './reservation-dialog-component.css',
})
export class ReservationDialogComponent {
  reservation: Reservation;
  tables: Table[];
  users: User[];
  form!: FormGroup;
  statuss = [
      { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Reservation,
    private _dialogRef: MatDialogRef<ReservationDialogComponent>,
    private reservationService: ReservationService,
    private tableService: TableService,
    private userService: UserService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.reservation = { ...this.data };
    this.tables = [];
    this.users = [];
    
    // Cargar mesas
    this.tableService.findAll().subscribe(
      (cats: Table[]) => {
        this.tables = cats;
      }
    );

    // Cargar usuarios
    this.userService.findAll().subscribe(
      (cats: User[]) => {
        this.users = cats;
      }
    );
    
    this.form = this.fb.group({
      reservationDate: this.fb.control(this.reservation.reservationDate ?? '', [Validators.required]),
      reservationTime: this.fb.control(this.reservation.reservationTime ?? '', [Validators.required]),
      status: this.fb.control(this.reservation.status ?? false, [Validators.required]),
      idTable: this.fb.control(this.reservation.idTable ?? '', [Validators.required]),
      idUser: this.fb.control(this.reservation.idUser ?? '', [Validators.required]),
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
    const payload: Reservation = {
      ...this.reservation,
      reservationDate: formVal.reservationDate,
      reservationTime: formVal.reservationTime,
      idTable: formVal.idTable,
      idUser: formVal.idUser ,
      status: formVal.status
    };

    if (payload != null && payload.idReservation > 0 ) {
      // UPDATE
      this.reservationService.update(payload.idReservation, payload)
        .pipe(switchMap(() => this.reservationService.findAll()))
        .subscribe(data => {
          this.reservationService.setModelChange(data);
          this.reservationService.setMessageChange('UPDATED!');
        });
    } else {
      // INSERT
      this.reservationService.save(payload)
        .pipe(switchMap(() => this.reservationService.findAll()))
        .subscribe(data => {
          this.reservationService.setModelChange(data);
          this.reservationService.setMessageChange('CREATED!');
        });
    }

    this.close();
  }
}
