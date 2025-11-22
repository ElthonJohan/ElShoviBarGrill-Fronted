import { Component, Inject } from '@angular/core';
import { Category } from '../../../model/category';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category-service';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-dialog-component',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
],
  templateUrl: './category-dialog-component.html',
  styleUrl: './category-dialog-component.css',
})
export class CategoryDialogComponent {
   category: Category;
   form!:FormGroup;
   isEdit=false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Category,
    private _dialogRef: MatDialogRef<CategoryDialogComponent>,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private snackBar:MatSnackBar
  ){}

  ngOnInit(): void {
    this.isEdit=!!this.data;
    this.category = {... this.data}; //spread operator

    this.form=this.fb.group({
      name: this.fb.control(this.category.name ??'',[Validators.required]),
      description: this.fb.control(this.category.description ?? '')

    })
  }

  close(){
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


  operate(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    const formVal=this.form.value;
    const payload:Category={
      ...this.data,
      name:formVal.name,
      description:formVal.description
    }

    if(payload != null && payload.idCategory > 0){
      //UPDATE
      this.categoryService.update(this.category.idCategory, this.category)
        .pipe(switchMap ( () => this.categoryService.findAll()))
        .subscribe({
      next: (data) => {
        this.categoryService.setModelChange(data);
        this.categoryService.setMessageChange('CATEGORIA ACTUALIZADA');
        this._dialogRef.close(payload);
      },
      error: (err) => this.handleError(err)
    });
    }else{
      //INSERT
      this.categoryService.save(this.category)
        .pipe(switchMap ( () => this.categoryService.findAll()))
        .subscribe({
      next: (data) => {
        this.categoryService.setModelChange(data);
        this.categoryService.setMessageChange('CATEGORIA CREADA');
        this._dialogRef.close(payload);
      },
      error: (err) => this.handleError(err)
    });
    }

  }
}
