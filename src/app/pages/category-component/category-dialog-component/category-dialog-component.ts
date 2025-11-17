import { Component, Inject } from '@angular/core';
import { Category } from '../../../model/category';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category-service';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category-dialog-component',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './category-dialog-component.html',
  styleUrl: './category-dialog-component.css',
})
export class CategoryDialogComponent {
   category: Category;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Category,
    private _dialogRef: MatDialogRef<CategoryDialogComponent>,
    private categoryService: CategoryService,
  ){}

  ngOnInit(): void {
    this.category = {... this.data}; //spread operator
    //this.medic = this.data;
    /*this.medic = new Medic();
    this.medic.idMedic = this.data.idMedic;
    this.medic.idSpecialty = this.data.idSpecialty;
    this.medic.primaryName = this.data.primaryName;
    this.medic.surname = this.data.surname;
    this.medic.photo = this.data.photo;*/

  }

  close(){
    this._dialogRef.close();
  }

  operate(){
    if(this.category != null && this.category.idCategory > 0){
      //UPDATE
      this.categoryService.update(this.category.idCategory, this.category)
        .pipe(switchMap ( () => this.categoryService.findAll()))
        .subscribe(data => {
          this.categoryService.setModelChange(data);
          this.categoryService.setMessageChange('UPDATED!');
        });
    }else{
      //INSERT
      this.categoryService.save(this.category)
        .pipe(switchMap ( () => this.categoryService.findAll()))
        .subscribe(data => {
          this.categoryService.setModelChange(data);
          this.categoryService.setMessageChange('CREATED!');
        });
    }

    this.close();
  }
}
