import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../model/category';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MenuItem } from '../../../model/menuitem';
import { MenuItemService } from '../../../services/menu-item-service';
import { CategoryService } from '../../../services/category-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-dialog-component',
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
  templateUrl: './product-dialog-component.html',
  styleUrl: './product-dialog-component.css',
})
export class ProductDialogComponent {
  form!: FormGroup;
  isEdit = false;

  categories: Category[] = [];

  actives = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: MenuItem,
    private _dialogRef: MatDialogRef<ProductDialogComponent>,
    private menuItemService: MenuItemService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
      private snackBar: MatSnackBar

  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;

    this.form = this.fb.group({
    category: [this.data?.idCategory || null, Validators.required],
    name:[this.data?.name||null, Validators.required],
    description:[this.data?.description||null],
    price:[this.data?.price||null, Validators.required],
    imageUrl:[this.data?.imageUrl||null],
    active:[this.data?.active||null, Validators.required],
  });

  this.loadCategory();
  }

  loadCategory() {
    // Cargar categorias
    this.categoryService.findAll().subscribe((cats: Category[]) => {
      this.categories = cats;
    });
  }

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

    const payload: MenuItem = {
      ...this.data,
      idCategory: form.category,
      name: form.name,
      description: form.description,
      price: form.price,
      imageUrl: form.imageUrl,

      active: form.active,
    };

    console.log('Payload enviado:', payload);
// UPDATE
if (payload.idMenuItem && payload.idMenuItem > 0) {
  this.menuItemService
    .update(payload.idMenuItem, payload)
    .pipe(switchMap(() => this.menuItemService.findAll()))
    .subscribe({
      next: (data) => {
        this.menuItemService.setModelChange(data);
        this.menuItemService.setMessageChange('PRODUCTO ACTUALIZADO');
        this._dialogRef.close(payload);
      },
      error: (err) => this.handleError(err)
    });
} 
else {
  // INSERT
  this.menuItemService
    .save(payload)
    .pipe(switchMap(() => this.menuItemService.findAll()))
    .subscribe({
      next: (data) => {
        this.menuItemService.setModelChange(data);
        this.menuItemService.setMessageChange('PRODUCTO CREADO');
        this._dialogRef.close(payload);
      },
      error: (err) => this.handleError(err)
    });
}

  }

}
