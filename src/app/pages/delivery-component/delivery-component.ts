import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Delivery } from '../../model/delivery';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeliveryService } from '../../services/delivery-service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { DeliveryDialogComponent } from './delivery-dialog-component/delivery-dialog-component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-delivery-component',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './delivery-component.html',
  styleUrls: ['./delivery-component.css'],
})
export class DeliveryComponent {
  dataSource: MatTableDataSource<Delivery> = new MatTableDataSource<Delivery>();

  columnsDefinitions = [
    { def: 'idDelivery', label: 'idDelivery', hide: true },
    { def: 'order', label: 'order', hide: false },
    { def: 'address', label: 'address', hide: false },
    { def: 'phone', label: 'phone', hide: false },
    { def: 'driverName', label: 'driverName', hide: false },
    { def: 'vehiclePlate', label: 'vehiclePlate', hide: false },
    { def: 'status', label: 'status', hide: false },
    { def: 'deliveryTime', label: 'deliveryTime', hide: false },
    { def: 'actions', label: 'actions', hide: false },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private deliveryService: DeliveryService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.deliveryService.findAll().subscribe((data) => this.createTable(data));
    this.deliveryService
      .getModelChange()
      .subscribe((data) => this.createTable(data));
    this.deliveryService
      .getMessageChange()
      .subscribe((data) =>
        this._snackBar.open(data, 'INFO', { duration: 2000 })
      );
  }

  createTable(data: Delivery[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  openDialog(delivery?: Delivery) {
    this._dialog.open(DeliveryDialogComponent, {
      width: '750px',
      data: delivery,
    });
  }

  applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim();
  }
  delete(id: number) {
    this.deliveryService
      .delete(id)
      .pipe(switchMap(() => this.deliveryService.findAll()))
      .subscribe((data) => {
        this.deliveryService.setModelChange(data);
        this.deliveryService.setMessageChange('CATEGORÍA ELIMINADA!');
      });
  }
}
