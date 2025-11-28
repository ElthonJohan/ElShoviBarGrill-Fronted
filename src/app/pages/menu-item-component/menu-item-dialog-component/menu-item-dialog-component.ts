import { Component, Inject } from '@angular/core';
import { MenuItem } from '../../../model/menuitem';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MenuItemService } from '../../../services/menu-item-service';
import { CategoryService } from '../../../services/category-service';
import { catchError, map, of, switchMap } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../../model/category';

@Component({
  selector: 'app-menu-item-dialog-component',
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
  templateUrl: './menu-item-dialog-component.html',
  styleUrl: './menu-item-dialog-component.css',
})
export class MenuItemDialogComponent {
  menuItem: MenuItem;
  categories: Category[];
  form!: FormGroup;
  availables = [
      { value: true, label: 'Disponible' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: MenuItem,
    private _dialogRef: MatDialogRef<MenuItemDialogComponent>,
    private menuItemService: MenuItemService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.menuItem = { ...this.data };
    this.categories = [];
    
    // Cargar categorías
    this.categoryService.findAll().subscribe(
      (cats: Category[]) => {
        this.categories = cats;
      }
    );
    
    this.form = this.fb.group({
      name: this.fb.control(this.menuItem.name ?? '', {
        validators: [],
        asyncValidators: [this.menuNameUniqueValidator()],
        updateOn: 'blur'
      }),
      description: this.fb.control(this.menuItem.description ?? '', [Validators.required]),
      available: this.fb.control(this.menuItem.active ?? false, [Validators.required]),
      price: this.fb.control(this.menuItem.price ?? '', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]),
      imageUrl: this.fb.control(this.menuItem.imageUrl ?? ''),
      idCategory: this.fb.control(this.menuItem.idCategory ?? '', [Validators.required])
    });
  }

  /** Async validator: checks backend for existing tableNumber and ignores current table id */
  menuNameUniqueValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value == null || value === '') {
        return of(null);
      }
      return this.menuItemService.findAll().pipe(
        map((menues: MenuItem[]) => {
          const exists = menues.some(t => t.name == value && t.idMenuItem !== this.menuItem?.idMenuItem);
          return exists ? { menuNameExists: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

  close(){
    this._dialogRef.close();
  }

  compareBoolean(b1: boolean, b2: boolean): boolean {
    return b1 === b2;
  }

  operate(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // merge form values into table object
    const formVal = this.form.value;
    const payload: MenuItem = {
      ...this.menuItem,
      name: formVal.name,
      description: formVal.description,
      price: parseFloat(formVal.price),
      imageUrl: formVal.imageUrl ? formVal.imageUrl : '',
      active: formVal.available,
      idCategory: parseInt(formVal.idCategory, 10)
    };

    if (payload != null && payload.idMenuItem > 0 ) {
      // UPDATE
      this.menuItemService.update(payload.idMenuItem, payload)
        .pipe(switchMap(() => this.menuItemService.findAll()))
        .subscribe(data => {
          this.menuItemService.setModelChange(data);
          this.menuItemService.setMessageChange('UPDATED!');
        });
    } else {
      // INSERT
      this.menuItemService.save(payload)
        .pipe(switchMap(() => this.menuItemService.findAll()))
        .subscribe(data => {
          this.menuItemService.setModelChange(data);
          this.menuItemService.setMessageChange('CREATED!');
        });
    }

    this.close();
  }
}
