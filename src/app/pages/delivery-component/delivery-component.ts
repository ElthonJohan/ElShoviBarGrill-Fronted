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
import { deliveryStatus, DeliveryStatus } from '../../model/enums/deliverystatus';
import { CommonModule } from '@angular/common';
import { MatChipOption, MatChip } from '@angular/material/chips';
import { OrderService } from '../../services/order-service';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
    MatSelect,
    MatOption,
    CommonModule,
    FormsModule,
    RouterLink,
    MatChip
],
  templateUrl: './delivery-component.html',
  styleUrls: ['./delivery-component.css'],
})
export class DeliveryComponent {
  dataSource: MatTableDataSource<Delivery> = new MatTableDataSource<Delivery>();
  
  status =DeliveryStatus;

  statuses= deliveryStatus;

  deliveries: Delivery[] = [];
    filtered: Delivery[] = [];

      // filtros
  statusFilter: string = '';
  orderIdFilter: string = '';
  startDateFilter: string = '';
  endDateFilter: string = '';


  columnsDefinitions = [
    { def: 'idDelivery', label: 'idDelivery', hide: true },
    { def: 'idOrder', label: 'idOrder', hide: false },
    { def: 'user', label: 'user', hide: false },
    { def: 'address', label: 'address', hide: false },

    { def: 'phone', label: 'phone', hide: false },
    { def: 'driverName', label: 'driverName', hide: false },
    { def: 'vehiclePlate', label: 'vehiclePlate', hide: false },
    { def: 'status', label: 'status', hide: false },
    { def: 'deliveryTime', label: 'deliveryTime', hide: false },
    { def: 'actions', label: 'actions', hide: false }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private deliveryService: DeliveryService,
    private orderService: OrderService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.deliveryService
      .findAll()
      .subscribe((data) => this.createTable(data));
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
  
      this.deliveries = data;
  
    this.deliveries.forEach(d => {
  
      // 1. Cargar nombre del usuario
      this.orderService.findById(d.idOrder).subscribe(order => {
        d.userName = order.userName;
      });
    });
  
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
     getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }
  

  loadDeliveries(){
    this.deliveryService.findAll().subscribe({
      next: data => this.dataSource =new MatTableDataSource(data),
      error: err => console.error('Error cargando deliveries:', err)
    });
  }

   applyFilters() {
    this.filtered = this.deliveries.filter(d => {

      const statusMatch =
        !this.statusFilter || d.status === this.statusFilter;

      const orderMatch =
        !this.orderIdFilter ||
        d.idOrder.toString().includes(this.orderIdFilter);

      const startMatch =
        !this.startDateFilter ||
        new Date(d.deliveryTime) >= new Date(this.startDateFilter);

      const endMatch =
        !this.endDateFilter ||
        new Date(d.deliveryTime) <= new Date(this.endDateFilter);

      return statusMatch && orderMatch && startMatch && endMatch;
    });
  }

    clearFilters() {
    this.statusFilter = '';
    this.orderIdFilter = '';
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.filtered = [...this.deliveries];
  }

  markAsDelivered(delivery: Delivery): void {
    const updated: Delivery = {
      ...delivery,
      status: this.status.ENTREGADO
    };

    this.deliveryService.update(delivery.idDelivery!, updated).subscribe({
      next: () => this.loadDeliveries(),
      error: err => console.error('Error actualizando delivery:', err)
    });
  }
      applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }


  deleteDelivery(id:number) {
    this.deliveryService
          .delete(id)
          .pipe(switchMap(() => this.deliveryService.findAll()))
          .subscribe((data) => {
            this.deliveryService.setModelChange(data);
            this.deliveryService.setMessageChange('DELIVERY ELIMINADO!');
          });
  }
}
