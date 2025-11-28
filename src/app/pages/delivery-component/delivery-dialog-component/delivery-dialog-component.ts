import { Component, Inject } from '@angular/core';
import { Delivery } from '../../../model/delivery';
import { Order } from '../../../model/order';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from '../../../services/order-service';
import { DeliveryService } from '../../../services/delivery-service';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delivery-dialog-component',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './delivery-dialog-component.html',
  styleUrl: './delivery-dialog-component.css',
})
export class DeliveryDialogComponent {
  delivery: Delivery;
  orders: Order[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Delivery,
    private _dialogRef: MatDialogRef<DeliveryDialogComponent>,
    private deliveryService: DeliveryService,
    private orderService: OrderService
  ){}

  ngOnInit(): void {
    this.delivery = {... this.data}; //spread operator
    //this.medic = this.data;
    /*this.medic = new Medic();
    this.medic.idMedic = this.data.idMedic;
    this.medic.idSpecialty = this.data.idSpecialty;
    this.medic.primaryName = this.data.primaryName;
    this.medic.surname = this.data.surname;
    this.medic.photo = this.data.photo;*/

    this.orderService.findAll().subscribe(data => this.orders = data);
  }

  close(){
    this._dialogRef.close();
  }

  operate(){
    if(this.delivery != null && this.delivery.idDelivery > 0){
      //UPDATE
      this.deliveryService.update(this.delivery.idDelivery, this.delivery)
        .pipe(switchMap ( () => this.deliveryService.findAll()))
        .subscribe(data => {
          this.deliveryService.setModelChange(data);
          this.deliveryService.setMessageChange('UPDATED!');
        });
    }else{
      //INSERT
      this.deliveryService.save(this.delivery)
        .pipe(switchMap ( () => this.deliveryService.findAll()))
        .subscribe(data => {
          this.deliveryService.setModelChange(data);
          this.deliveryService.setMessageChange('CREATED!');
        });
    }

    this.close();
  }
}
