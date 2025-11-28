import { Component, Inject } from '@angular/core';
import { OrderItem } from '../../../model/orderitem';
import { MenuItem } from '../../../model/menuitem';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Order } from '../../../model/order';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OrderItemService } from '../../../services/order-item-service';
import { MenuItemService } from '../../../services/menu-item-service';
import { OrderService } from '../../../services/order-service';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-order-item-dialog-component',
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
  templateUrl: './order-item-dialog-component.html',
  styleUrl: './order-item-dialog-component.css',
})
export class OrderItemDialogComponent {
  // orderItem: OrderItem;
  // menues: MenuItem[];
  // orders:Order[];
  // form!: FormGroup;

  // constructor(
  //   @Inject(MAT_DIALOG_DATA) private data: OrderItem,
  //   private _dialogRef: MatDialogRef<OrderItemDialogComponent>,
  //   private orderItemService: OrderItemService,
  //   private menuItemService: MenuItemService,
  //   private orderService: OrderService,
  //   private fb: FormBuilder
  // ){}

  // ngOnInit(): void {
  //   this.orderItem = { ...this.data };
  //   this.menues = [];
  //   this.orders=[];
    
  //   // Cargar menues
  //   this.menuItemService.findAll().subscribe(
  //     (cats: MenuItem[]) => {
  //       this.menues = cats;
  //     }
  //   );

  //   // Cargar menues
  //   this.orderService.findAll().subscribe(
  //     (cats: Order[]) => {
  //       this.orders = cats;
  //     }
  //   );
    
  //   this.form = this.fb.group({
  //     quantity: this.fb.control(this.orderItem.quantity ?? ''),
  //     unitPrice: this.fb.control(this.orderItem.unitPrice ?? '', [Validators.required]),
  //     idMenuItem: this.fb.control(this.orderItem.idMenuItem ?? false, [Validators.required]),
  //     idOrder: this.fb.control(this.orderItem.idOrder ?? '', [Validators.required, Validators.required])

  //   });
  // }

  // /** Async validator: checks backend for existing tableNumber and ignores current table id */


  // close(){
  //   this._dialogRef.close();
  // }


  // operate(){
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }

  //   // merge form values into table object
  //   const formVal = this.form.value;
  //   const payload: OrderItem = {
  //     ...this.orderItem,
  //     quantity: formVal.quantity,
  //     unitPrice: formVal.unitPrice,
  //     idOrder: parseFloat(formVal.idOrder),
  //     idMenuItem: formVal.idMenuItem,
  //   };

  //   if (payload != null && payload.idMenuItem > 0 ) {
  //     // UPDATE
  //     this.orderItemService.update(payload.idOrderItem, payload)
  //       .pipe(switchMap(() => this.orderItemService.findAll()))
  //       .subscribe(data => {
  //         this.orderItemService.setModelChange(data);
  //         this.orderItemService.setMessageChange('UPDATED!');
  //       });
  //   } else {
  //     // INSERT
  //     this.orderItemService.save(payload)
  //       .pipe(switchMap(() => this.orderItemService.findAll()))
  //       .subscribe(data => {
  //         this.orderItemService.setModelChange(data);
  //         this.orderItemService.setMessageChange('CREATED!');
  //       });
  //   }

  //   this.close();
  // }
}
