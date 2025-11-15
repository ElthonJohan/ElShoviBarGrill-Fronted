import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category-service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Category } from '../../../model/category';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './category-edit-component.html',
  styleUrl: './category-edit-component.css'
})
export class CategoryEditComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario vacío
    this.form = this.fb.group({
      idCategory: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });

    // Detecta si es edición o creación
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.isEdit = params['id'] != null;

      if (this.isEdit) {
        this.categoryService.findById(this.id).subscribe((data) => {
          this.form.patchValue(data);
        });
      }
    });
  }

  operate(): void {
    const category: Category = this.form.value;

    if (this.isEdit) {
  // Editar categoría existente
  this.categoryService.update(category.idCategory, category).pipe(
    switchMap(() => this.categoryService.findAll())
  ).subscribe((data) => {
    this.categoryService.setModelChange(data);
    this.categoryService.setMessageChange('CATEGORÍA ACTUALIZADA!');
  });
} else {
  // Crear nueva categoría
  this.categoryService.save(category).pipe(
    switchMap(() => this.categoryService.findAll())
  ).subscribe((data) => {
    this.categoryService.setModelChange(data);
    this.categoryService.setMessageChange('CATEGORÍA REGISTRADA!');
  });
}


    this.router.navigate(['/pages/category']);
  }

  cancel(): void {
    this.router.navigate(['/pages/category']);
  }
}
