import { Component, Inject } from '@angular/core';
import { Delivery } from '../../../model/delivery';
import { Order } from '../../../model/order';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { OrderService } from '../../../services/order-service';
import { DeliveryService } from '../../../services/delivery-service';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MenuItem } from '../../../model/menuitem';
import { User } from '../../../model/user';
import { Table } from '../../../model/table';
import { OrderType, orderTypes } from '../../../model/enums/ordertype';
import { orderStatus } from '../../../model/enums/orderstatus';
import { MenuItemService } from '../../../services/menu-item-service';
import { TableService } from '../../../services/table-service';
import { UserService } from '../../../services/user-service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderItem } from '../../../model/orderitem';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-delivery-dialog-component',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardContent,
    MatCard,
  ],
  templateUrl: './delivery-dialog-component.html',
  styleUrl: './delivery-dialog-component.css',
})
export class DeliveryDialogComponent {
  // --- FORM & ESTADO ---
  form!: FormGroup;
  editingId?: number;

  // --- DATA PARA SELECTS / UI ---
  menuItems: MenuItem[] = [];
  users: User[] = [];
  tables: Table[] = [];

  types = orderTypes;
  // sólo EN_MESA y PARA_LLEVAR
  statuss = orderStatus;
  typeEnum = OrderType;

  showMesa: boolean = true;
  isPaid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private menuItemService: MenuItemService,
    private tableService: TableService,
    private userService: UserService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // =========================================================
  // LIFECYCLE
  // =========================================================

  ngOnInit(): void {
    
    this.initForm();
    this.detectEditingMode();
    this.loadMenuItems();
    this.loadUsers();
    this.loadTables();
    this.setupTableValidation();
    this.setupOrderTypeBehaviour();

    this.form.get('orderType')?.valueChanges.subscribe((type) => {
      // Mostrar mesa SOLO si es EN_MESA
      this.showMesa = type === 'EN_MESA';

      if (!this.showMesa) {
        this.form.get('idTable')?.setValue(null);
        this.form.get('idTable')?.disable();
      } else {
        this.form.get('idTable')?.enable();
      }
    });
  }

  // =========================================================
  // INICIALIZACIÓN
  // =========================================================

  private initForm() {
    this.form = this.fb.group({
      idUser: ['', Validators.required],
      idTable: [''],
      idPayment: [''],
      orderType: [{ value: 'DELIVERY', disabled: true }, Validators.required],
      status: ['PENDIENTE', Validators.required],
      notes: [''],
      items: this.fb.array([], Validators.required),
    });
  }

  private detectEditingMode() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id && !isNaN(Number(id))) {
        this.editingId = Number(id);
        this.loadOrder(this.editingId);
      }
    });
  }

  // =========================================================
  // CARGA DE DATOS
  // =========================================================

  private loadMenuItems() {
    this.menuItemService.findAll().subscribe((menu) => (this.menuItems = menu));
  }

  private loadUsers() {
    this.userService.findAll().subscribe((u) => (this.users = u));
  }

  private loadTables() {
    this.tableService.findAll().subscribe((tablas) => {
      // Marcamos cuáles mesas están ocupadas (para UI si quieres)
      tablas.forEach((t) => {
        this.orderService.mesaOcupada(t.idTable).subscribe((ocupada) => {
          t.ocupada = ocupada;
        });
      });

      this.tables = tablas;
    });
  }

  private loadOrder(id: number) {
    this.orderService.findById(id).subscribe((order) => {
      // 👉 Si ya está completada, no permitir edición
      if (order.status === 'COMPLETADA') {
        alert('Esta orden ya fue completada. Mostrando detalle...');
        this.router.navigate(['/admin/order-details', id]); // <-- ruta al detalle
        return;
      }

      // Rellenar form
      this.form.patchValue({
        idUser: order.idUser,
        idTable: order.idTable,
        idPayment: order.idPayment,
        orderType: order.orderType,
        status: order.status,
        notes: order.notes,
      });

      this.isPaid = !!order.idPayment;

      if (this.isPaid) {
        this.form.get('idTable')?.disable();
        this.form.get('status')?.disable();
      }

      // ============================================
      // 🔒 DESHABILITAR MESA SI ES DELIVERY O LLEVAR
      // ============================================
      if (order.orderType === 'DELIVERY' || order.orderType === 'LLEVAR') {
        this.form.get('idTable')?.disable();
        this.form.get('idTable')?.setValue(null); // asegurar que no tenga mesa
      } else {
        this.form.get('idTable')?.enable();
      }

      if (order.orderType === 'EN_MESA') {
        this.showMesa = true;
        this.form.get('idTable')?.enable();
      } else {
        this.showMesa = false;
        this.form.get('idTable')?.disable();
        this.form.get('idTable')?.setValue(null);
      }

      // ============================================
      // 💥 Limpiar items actuales antes de agregar
      // ============================================
      this.items.clear();

      // ============================================
      // 🔄 Agregar items con información real del menú
      // ============================================
      order.items.forEach((item) => {
        this.menuItemService.findById(item.idMenuItem).subscribe((menu) => {
          this.items.push(
            this.fb.group({
              idOrderItem: [item.idOrderItem],
              idMenuItem: [item.idMenuItem, Validators.required],
              quantity: [
                item.quantity,
                [Validators.required, Validators.min(1)],
              ],
              unitPrice: [item.unitPrice, Validators.required],
              name: [menu.name],
              imageUrl: [menu.imageUrl],
            })
          );
        });
      });
    });
  }

  // =========================================================
  // REGLAS DE NEGOCIO (VALIDACIONES REACTIVAS)
  // =========================================================

  // Validar mesa ocupada al cambiar la mesa
  private setupTableValidation() {
    this.form.get('idTable')?.valueChanges.subscribe((idMesa) => {
      // ❌ NO validar mesa si la orden ya está pagada
      if (this.isPaid) return;

      if (!idMesa) return;

      const excluir = this.editingId ?? null;

      this.orderService
        .checkMesaDisponible(idMesa, excluir)
        .subscribe((disponible) => {
          if (!disponible) {
            alert(
              '⚠️ Esta mesa ya tiene una orden activa. Marca la orden anterior como COMPLETADA antes de usarla.'
            );
            this.form.get('idTable')?.setValue(null);
          }
        });
    });
  }

  // Comportamiento cuando cambia el tipo de orden
  private setupOrderTypeBehaviour() {
    this.form.get('orderType')?.valueChanges.subscribe((type) => {
      if (type === 'DELIVERY' || type === this.typeEnum.LLEVAR) {
        // Por si algún día reusas el componente con DELIVERY
        this.form.get('idTable')?.setValue(null);
        this.form.get('idTable')?.disable();
      } else {
        this.form.get('idTable')?.enable();
      }
    });
  }

  // =========================================================
  // GETTERS
  // =========================================================

  getQuantityControl(index: number): FormControl {
    return (this.items.at(index) as FormGroup).get('quantity') as FormControl;
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  getItemFormGroup(index: number): FormGroup {
    return this.items.at(index) as FormGroup;
  }

  get total(): number {
    return this.items.value.reduce(
      (acc: number, it: any) => acc + it.quantity * it.unitPrice,
      0
    );
  }

  // =========================================================
  // MANEJO DE ITEMS
  // =========================================================

  addItem(item: MenuItem) {
    // 1. Buscar si el ítem ya existe en la lista
    const index = this.items.value.findIndex(
      (i: any) => i.idMenuItem === item.idMenuItem
    );

    // 2. Si ya existe → aumentar cantidad
    if (index !== -1) {
      const fg = this.items.at(index) as FormGroup;
      const currentQty = fg.get('quantity')?.value || 1;
      fg.get('quantity')?.setValue(currentQty + 1);
      return;
    }

    // 3. Si NO existe → agregar nuevo
    this.items.push(
      this.fb.group({
        idOrderItem: [null],
        idMenuItem: [item.idMenuItem, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unitPrice: [item.price, Validators.required],
        name: [item.name],
        imageUrl: [item.imageUrl], // si lo usas
      })
    );
  }

  removeItem(i: number) {
    this.items.removeAt(i);
  }

  private mapFormItemsToOrderItems(): OrderItem[] {
    return this.items.value.map((item: any) => ({
      idMenuItem: item.idMenuItem,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));
  }

  // =========================================================
  // GUARDAR ORDEN
  // =========================================================

  saveOrder() {
    console.log('Formulario a guardar:', this.form.value);
    console.log('Items del formulario:', this.items.value);
    console.log('Total calculado:', this.total);
    if (this.form.invalid || this.items.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const dto: Order = {
  idOrder: this.editingId ?? null,
  idUser: raw.idUser,
  idTable: raw.orderType === 'DELIVERY' ? null : raw.idTable,
  idPayment: raw.idPayment || null,
  orderType: raw.orderType,
  status: raw.status,
  notes: raw.notes,
  items: this.mapFormItemsToOrderItems(),
  totalAmount: this.total
};

    console.log('DTO a guardar:', dto);

    // 🟡 Si NO es DELIVERY → validar mesa en backend antes de guardar
    if (
      this.form.value.orderType !== 'DELIVERY' &&
      this.form.value.orderType !== this.typeEnum.LLEVAR &&
      this.form.value.idTable
    ) {
      if (!this.form.value.idTable) {
        alert('Seleccione una mesa');
        return;
      }

      this.orderService
        .checkMesaDisponible(this.form.value.idTable, this.editingId ?? null)
        .subscribe((disponible) => {
          if (!disponible) {
            alert('❌ Esta mesa está ocupada por otra orden activa.');
            return;
          }

          // Mesa libre → guardar
          this.procesarGuardado(dto);
        });

      return; // muy importante para no ejecutar doble
    }

    // 🟢 DELIVERY (por si algún día lo permites aquí) → guardar directo
    this.procesarGuardado(dto);
  }

  private procesarGuardado(dto: Order) {
    // MODO EDICIÓN
    if (this.editingId) {
      this.orderService.update(this.editingId, dto).subscribe({
        next: () => {
          alert('Orden actualizada correctamente');
          this.router.navigate(['/admin/orderregister']);
        },
        error: (err) => console.error(err),
      });
      return;
    }

    // MODO CREACIÓN
    this.orderService.save(dto).subscribe({
      next: (saved) => {
        alert('Orden creada correctamente');

        // Si en algún momento permites DELIVERY aquí, mantiene esta lógica:
        if (saved.orderType === this.typeEnum.DELIVERY) {
          this.userService.findById(saved.idUser).subscribe((user) => {
            this.router.navigate(['/admin/delivery/new'], {
              queryParams: {
                idOrder: saved.idOrder,
                userName: user.userName,
              },
            });
          });
        }
        else {
        this.router.navigate(['/admin/orderregister']);
      }
        this.form.reset();
        this.items.clear();
      },
      error: (err) => console.error(err),
    });
  }
}
