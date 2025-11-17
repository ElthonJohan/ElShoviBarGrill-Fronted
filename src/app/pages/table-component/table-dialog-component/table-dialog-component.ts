import { Component, Inject } from '@angular/core';
import { Table } from '../../../model/table';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TableService } from '../../../services/table-service';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-table-dialog-component',
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
  templateUrl: './table-dialog-component.html',
  styleUrls: ['./table-dialog-component.css'],
})
export class TableDialogComponent {
  table: Table;
  form!: FormGroup;
  statuses = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Table,
    private _dialogRef: MatDialogRef<TableDialogComponent>,
    private tableService: TableService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.table = { ...this.data };
    this.form = this.fb.group({
      tableNumber: this.fb.control(this.table.tableNumber ?? '', {
        validators: [Validators.required],
        asyncValidators: [this.tableNumberUniqueValidator()],
        updateOn: 'blur'
      }),
      capacity: this.fb.control(this.table.capacity ?? '', [Validators.required]),
      status: this.fb.control(this.table.status ?? '', [Validators.required])
    });
    //this.medic = this.data;
    /*this.medic = new Medic();
    this.medic.idMedic = this.data.idMedic;
    this.medic.idSpecialty = this.data.idSpecialty;
    this.medic.primaryName = this.data.primaryName;
    this.medic.surname = this.data.surname;
    this.medic.photo = this.data.photo;*/

  }

  /** Async validator: checks backend for existing tableNumber and ignores current table id */
  tableNumberUniqueValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value == null || value === '') {
        return of(null);
      }
      return this.tableService.findAll().pipe(
        map((tables: Table[]) => {
          const exists = tables.some(t => t.tableNumber == value && t.idTable !== this.table?.idTable);
          return exists ? { tableNumberExists: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

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
    const payload: Table = {
      ...this.table,
      tableNumber: formVal.tableNumber,
      capacity: formVal.capacity,
      status: formVal.status
    };

    if (payload != null && payload.idTable > 0 ) {
      // UPDATE
      this.tableService.update(payload.idTable, payload)
        .pipe(switchMap(() => this.tableService.findAll()))
        .subscribe(data => {
          this.tableService.setModelChange(data);
          this.tableService.setMessageChange('UPDATED!');
        });
    } else {
      // INSERT
      this.tableService.save(payload)
        .pipe(switchMap(() => this.tableService.findAll()))
        .subscribe(data => {
          this.tableService.setModelChange(data);
          this.tableService.setMessageChange('CREATED!');
        });
    }

    this.close();
  }

}
