import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, ViewChild } from '@angular/core';
import { Order } from '../../model/order';
import { OrderService } from '../../services/order-service';
import { MatFormFieldModule, MatFormField, MatLabel } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupName, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../model/user';
import { Table } from '../../model/table';
import { TableService } from '../../services/table-service';
import { UserService } from '../../services/user-service';
import { MenuItem } from '../../model/menuitem';
import { MenuItemService } from '../../services/menu-item-service';
import { OrderType, orderTypes } from '../../model/enums/ordertype';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInput } from '@angular/material/datepicker';
import { OrderItem } from '../../model/orderitem';
import { OrderItemService } from '../../services/order-item-service';
import { OrderStatus, orderStatus } from '../../model/enums/orderstatus';
import { Router } from '@angular/router';
import { DeliveryStatus } from '../../model/enums/deliverystatus';

@Component({
  selector: 'app-order-component',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './order-component.html',
  styleUrl: './order-component.css',
})
export class OrderComponent {

  form!: FormGroup;
  isEdit:false;

  order:Order
  menuItems: MenuItem[] = [];
  users: User[] = [];
  tables: Table[] = [];

  orderItems:OrderItem[]=[];

  types = orderTypes;
  statuss=orderStatus;
  typeEnum=OrderType;


  // orderTypes = [
  //   { value: 'DINE_IN', label: 'En mesa' },
  //   { value: 'DELIVERY', label: 'Delivery' },
  //   { value: 'TAKEAWAY', label: 'Para llevar' }
  // ];

  constructor(
    private fb: FormBuilder,
    private menuItemService: MenuItemService,
    private tableService: TableService,
    private userService: UserService,
    private orderItemService: OrderItemService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {


    this.form = this.fb.group({
    idUser: ['', Validators.required],
    idTable: [''],
    idPayment: [''],
    orderType: ['', Validators.required],
    status: ['', Validators.required],
    notes: [''],
    items: this.fb.array([], Validators.required)
  });

    this.loadMenuItems();
    this.loadUsers();
    this.loadTables();

    // Cuando cambia tipo de orden, reinicia mesa si es delivery
    this.form.get('orderType')?.valueChanges.subscribe(type => {
      if (type === 'DELIVERY') {
        this.form.get('idTable')?.setValue(null);
        this.form.get('idTable')?.disable();
      } else {
        this.form.get('idTable')?.enable();
      }
    });
  }

  // =======================
  // GETTERS
  // =======================
  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  getItemFormGroup(index: number): FormGroup {
  return this.items.at(index) as FormGroup;
}

  // =======================
  // CARGAS INICIALES
  // =======================
  loadMenuItems() {
    this.menuItemService.findAll().subscribe(menu => this.menuItems = menu);
  }

  loadUsers() {
    this.userService.findAll().subscribe(u => this.users = u);
  }

  loadTables() {
    this.tableService.findAll().subscribe(t => this.tables = t);
  }

  // =======================
  // AGREGAR ITEM
  // =======================
  addItem(item: MenuItem) {
    this.items.push(
      this.fb.group({
        idMenuItem: [item.idMenuItem, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unitPrice: [item.price, Validators.required],
        name: [item.name] // SOLO para mostrar en la tabla, no se envía al backend
      })
    );
  }

  mapFormItemsToOrderItems(): OrderItem[] {
  return this.items.value.map((item: any) => ({
    idMenuItem: item.idMenuItem,
    quantity: item.quantity,
    unitPrice: item.unitPrice
  }));
}


  // =======================
  // ELIMINAR ITEM
  // =======================
  removeItem(i: number) {
    this.items.removeAt(i);
  }

  // =======================
  // TOTAL AUTOMÁTICO
  // =======================
  get total(): number {
    return this.items.value
      .reduce((acc: number, it: any) => acc + it.quantity * it.unitPrice, 0);
  }

  // =======================
  // GUARDAR ORDEN
  // =======================
  saveOrder() {

    console.log('Form value:', this.form.value);
console.log('Form invalid:', this.form.invalid);
console.log('Items length:', this.items.length);


    if (this.form.invalid || this.items.length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    
    console.log("Hola, hola");

    const orderItems = this.mapFormItemsToOrderItems();

    const dto: Order = {
      idUser: this.form.value.idUser,
    idTable: this.form.value.orderType === 'DELIVERY' ? null : this.form.value.idTable,
    idPayment: this.form.value.idPayment || null,
    orderType: this.form.value.orderType,
    status: this.form.value.status,
    notes: this.form.value.notes,
    items: orderItems,
    totalAmount: this.total
    };

    console.log('DTO enviado:', dto);


    this.orderService.save(dto).subscribe({
    next: saved => {
      alert("Orden creada correctamente");
        console.log("Redirigiendo a órdenes");


      // Solo si es DELIVERY → obtener el username y redirigir
      if (saved.orderType === this.typeEnum.DELIVERY) {
         this.userService.findById(saved.idUser).subscribe(user => {

          console.log("Usuario encontrado:", user);

          this.router.navigate(['/pages/delivery/new'], {
            queryParams: {
              idOrder: saved.idOrder,   // 👈 enviar id de la orden
              userName: user.userName  // 👈 enviar username
            }
          });
        });
      }
      this.form.reset();
      this.items.clear();
    },
    error: err => console.error(err)
  });
  }
    
    
  
}
