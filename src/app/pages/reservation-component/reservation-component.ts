import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Reservation } from '../../model/reservation';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ReservationService } from '../../services/reservation-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationDialogComponent } from './reservation-dialog-component/reservation-dialog-component';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { TableService } from '../../services/table-service';
import { UserService } from '../../services/user-service';
import { User } from '../../model/user';
import { Table } from '../../model/table';

@Component({
  selector: 'app-reservation-component',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    CommonModule,
  ],
  templateUrl: './reservation-component.html',
  styleUrl: './reservation-component.css',
})
export class ReservationComponent {
  reservations:Reservation[]=[];
  user: User;
  table: Table;

  dataSource: MatTableDataSource<Reservation> =
    new MatTableDataSource<Reservation>();

  columnsDefinitions = [
    { def: 'idReservation', label: 'idReservation', hide: true },
    { def: 'reservationDate', label: 'reservationDate', hide: false },
    { def: 'reservationTimeStart', label: 'reservationTimeStart', hide: false },
    { def: 'reservationTimeEnd', label: 'reservationTimeEnd', hide: false },

    { def: 'status', label: 'status', hide: false },
    { def: 'table', label: 'table', hide: false },
    { def: 'user', label: 'user', hide: false },
    { def: 'actions', label: 'actions', hide: false },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private reservationService: ReservationService,
    private tableService: TableService,
    private userService: UserService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.reservationService
      .findAll()
      .subscribe((data) => this.createTable(data));
    this.reservationService
      .getModelChange()
      .subscribe((data) => this.createTable(data));
    this.reservationService
      .getMessageChange()
      .subscribe((data) =>
        this._snackBar.open(data, 'INFO', { duration: 2000 })
      );
  }

  createTable(data: Reservation[]) {

    this.reservations = data;

  this.reservations.forEach(res => {

    // 1. Cargar nombre del usuario
    this.userService.findById(res.idUser).subscribe(user => {
      res.userName = user.userName;
    });

    // 2. Cargar número de mesa
    this.tableService.findById(res.idTable).subscribe(table => {
      res.tableNumber = table.tableNumber;
    });

  });

    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  openDialog(reservation?: Reservation) {
    this._dialog.open(ReservationDialogComponent, {
      width: '710px',
      maxWidth: '95vw',
      autoFocus: false,
      disableClose: true,
      data: reservation,
    });
  }
  formatTime(timeString: string): string {
    if (!timeString) return '';

    const [hours, minutes] = timeString.split(':').map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0);

    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  }

  applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    this.reservationService
      .delete(id)
      .pipe(switchMap(() => this.reservationService.findAll()))
      .subscribe((data) => {
        this.reservationService.setModelChange(data);
        this.reservationService.setMessageChange('RESERVACIÓN ELIMINADO!');
      });
  }
}
