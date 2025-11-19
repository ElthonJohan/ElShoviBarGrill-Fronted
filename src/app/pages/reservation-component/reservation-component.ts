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
import {MatDatepickerModule} from '@angular/material/datepicker';


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
    MatDatepickerModule
  ],
  templateUrl: './reservation-component.html',
  styleUrl: './reservation-component.css',
})
export class ReservationComponent {
  dataSource: MatTableDataSource<Reservation> = new MatTableDataSource<Reservation>();

  columnsDefinitions = [
    { def: 'idReservation', label: 'idReservation', hide: true },
    { def: 'reservationDate', label: 'reservationDate', hide: false },
    { def: 'reservationTime', label: 'description', hide: false },
    { def: 'status', label: 'status', hide: false },
    { def: 'idTable', label: 'isTable', hide: false },
    { def: 'idUser', label: 'idUser', hide: false },
    { def: 'actions', label: 'actions', hide: false }

  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private reservationService: ReservationService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.reservationService.findAll().subscribe((data) => this.createTable(data));
    this.reservationService.getModelChange().subscribe(data => this.createTable(data));
    this.reservationService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', { duration: 2000 }));
  }

  createTable(data: Reservation[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  openDialog(table?: Reservation) {
    this._dialog.open(ReservationDialogComponent, {
      width: '750px',
      data: table
    });
  }

  applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim();
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
