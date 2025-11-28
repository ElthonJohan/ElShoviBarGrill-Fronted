import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Order } from '../../../model/order';
import { DeliveryStatus } from '../../../model/enums/deliverystatus';
import { DeliveryService } from '../../../services/delivery-service';
import { OrderService } from '../../../services/order-service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user-service';

@Component({
  selector: 'app-delivery-register-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    MatIconModule

  ],
  templateUrl: './delivery-register-component.html',
  styleUrl: './delivery-register-component.css',
})
export class DeliveryRegisterComponent {
  form!: FormGroup;
  orders: Order[] = [];
  status = DeliveryStatus;

    userName: string = '';
  idOrder!: number;

  statusOptions: { value: DeliveryStatus; label: string }[] = [
    { value: this.status.PENDIENTE,   label: 'Pendiente' },
    { value: this.status.EN_CAMINO,   label: 'En camino' },
    { value: this.status.ENTREGADO,   label: 'Entregado' },
    { value: this.status.CANCELADO,   label: 'Cancelado' },
  ];

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private orderService: OrderService,
        private userService: UserService,

    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
         // Recibir username y idOrder desde queryParams
    this.route.queryParams.subscribe(params => {
      this.userName = params['userName'] || '';
      this.idOrder = params['idOrder'] ? Number(params['idOrder']) : 0;

      console.log("Username recibido:", this.userName);
      console.log("Order ID recibido:", this.idOrder);
    });


    this.form = this.fb.group({
      idOrder: [{ value: this.idOrder, disabled: true }, Validators.required],
      userName: [{ value: this.userName, disabled: true }, Validators.required],      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      driverName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      vehiclePlate: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      status: ['PENDIENTE', Validators.required],
      deliveryTime: ['', Validators.required] // type datetime-local en HTML
    });

    this.loadDeliveryOrders();
  }

  loadDeliveryOrders(): void {
    this.orderService.findAll().subscribe({
      next: orders => {
        // solo órdenes de tipo DELIVERY
        this.orders = orders.filter(o => o.orderType === 'DELIVERY');
      },
      error: err => {
        console.error('Error cargando órdenes:', err);
      }
    });
  }

  saveDelivery(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = {
      ...this.form.value,
      idOrder: this.idOrder,
      address: this.form.get('address')?.value,
      phone: this.form.get('phone')?.value,
      driverName: this.form.get('driverName')?.value,
      vehiclePlate: this.form.get('vehiclePlate')?.value,
      status: this.form.get('status')?.value,
      deliveryTime: this.form.get('deliveryTime')?.value
    };

        console.log("DTO enviado:", dto);

    this.deliveryService.save(dto).subscribe({
      next: res => {
        alert('Delivery registrado correctamente');

        this.form.reset({
          status: 'PENDIENTE'
        });
        this.router.navigate(['/pages/delivery']);

      },
      error: err => {
        console.error('Error al registrar delivery:', err);
        alert('Error al registrar delivery');
      }
    });
  }
}
