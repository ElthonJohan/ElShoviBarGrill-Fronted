import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Table } from '../../model/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TableService } from '../../services/table-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableDialogComponent } from './table-dialog-component/table-dialog-component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-table-component',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './table-component.html',
  styleUrl: './table-component.css',
})
export class TableComponent {
  dataSource: MatTableDataSource<Table> = new MatTableDataSource<Table>();

  columnsDefinitions = [
    { def: 'idTable', label: 'idTable', hide: true },
    { def: 'capacity', label: 'capacity', hide: false },
    { def: 'status', label: 'status', hide: false },
    { def: 'tableNumber', label: 'tableNumber', hide: false },
    { def: 'actions', label: 'actions', hide: false }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tableService: TableService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.tableService.findAll().subscribe((data) => this.createTable(data));
    this.tableService.getModelChange().subscribe(data => this.createTable(data));
    this.tableService.getMessageChange().subscribe((msg) =>
      this._snackBar.open(msg, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      })
    );
  }

  createTable(data: Table[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  openDialog(table?: Table) {
    this._dialog.open(TableDialogComponent, {
      width: '702px',
    maxWidth: '95vw',
    autoFocus: false,
    disableClose: true,
      data: table
    });
  }

  applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    this.tableService
      .delete(id)
      .pipe(switchMap(() => this.tableService.findAll()))
      .subscribe((data) => {
        this.tableService.setModelChange(data);
        this.tableService.setMessageChange('CATEGORÍA ELIMINADA!');
      });
  }
}
