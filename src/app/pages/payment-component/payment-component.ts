import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Payment } from '../../model/payment';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { PaymentService } from '../../services/payment-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentDialogComponent } from './payment-dialog-component/payment-dialog-component';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-payment-component',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule  
  ],
  templateUrl: './payment-component.html',
  styleUrl: './payment-component.css',
})
export class PaymentComponent {
  dataSource: MatTableDataSource<Payment> = new MatTableDataSource<Payment>();

  columnsDefinitions = [
    { def: 'idPayment', label: 'idPayment', hide: true },
    { def: 'amount', label: 'amount', hide: false },
    { def: 'name', label: 'name', hide: false },
    { def: 'paymentDate', label: 'paymentDate', hide: false },
    { def: 'paymentMethod', label: 'paymentMethod', hide: false },
    { def: 'status', label: 'status', hide: false },
    { def: 'actions', label: 'actions', hide: false }

  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private paymentService: PaymentService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.paymentService.findAll().subscribe((data) => this.createTable(data));
    this.paymentService.getModelChange().subscribe(data => this.createTable(data));
    this.paymentService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', { duration: 2000 }));
  }

  createTable(data: Payment[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  openDialog(table?: Payment) {
    this._dialog.open(PaymentDialogComponent, {
      width: '750px',
      data: table
    });
  }

  applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number) {
    this.paymentService
      .delete(id)
      .pipe(switchMap(() => this.paymentService.findAll()))
      .subscribe((data) => {
        this.paymentService.setModelChange(data);
        this.paymentService.setMessageChange('PAGO ELIMINADO!');
      });
  }

}
