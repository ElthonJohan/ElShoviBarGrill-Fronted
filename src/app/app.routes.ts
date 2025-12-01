import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './pages/category-component/category-component';
import { MenuItemComponent } from './pages/menu-item-component/menu-item-component';
import { OrderComponent } from './pages/order-component/order-component';
import { DeliveryComponent } from './pages/delivery-component/delivery-component';
import { OrderItemComponent } from './pages/order-item-component/order-item-component';
import { PaymentComponent } from './pages/payment-component/payment-component';
import { ReservationComponent } from './pages/reservation-component/reservation-component';
import { RoleComponent } from './pages/role-component/role-component';
import { TableComponent } from './pages/table-component/table-component';
import { UserComponent } from './pages/user-component/user-component';
import { LoginComponent } from './pages/login-component/login-component';
import { RegisterComponent } from './pages/register-component/register-component';
import { DashboardComponent } from './pages/dashboard-component/dashboard-component';
import { HomeComponent } from './pages/home-component/home-component';
import { ProductComponent } from './pages/product-component/product-component';
import { carritoComponent } from './pages/carrito-component/carrito-component';
import { OrderRegisterComponent } from './pages/order-register-component/order-register-component';
import { DeliveryRegisterComponent } from './pages/delivery-component/delivery-register-component/delivery-register-component';
import { OrderDetailsComponent } from './pages/order-component/order-details-component/order-details-component';
import { ClienteLayoutComponent } from './pages/cliente-layout-component/cliente-layout-component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RoleGuard } from './guards/role-guard';
import { LayoutComponent } from './pages/layout-component/layout-component';
import { PublicLayoutComponent } from './pages/public-layout-component/public-layout-component';
import { NgModule } from '@angular/core';
import { TarjetaComponent } from './pages/tarjeta-component/tarjeta-component';
import { AccessDenied } from './pages/access-denied/access-denied';


export const routes: Routes = [

   
  // ========================
  // 🌐 Rutas Públicas
  // ========================
  {
    path: '',
    component: ClienteLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'menu', component: MenuItemComponent },
    ]
  },

  // ========================
  // 👤 Área del Cliente (solo CLIENTE)
  // ========================
  {
    path: '',
    component: ClienteLayoutComponent,
    canActivate: [RoleGuard],
    data: { roles: ['cliente'] },
    children: [
      { path: 'carrito', component: carritoComponent },
      { path: 'pages/tarjeta-component', component:TarjetaComponent },
      // aquí puedes agregar más rutas cliente
    ]
  },

  // ========================
  // 🛠️ Área Admin / Mesero
  // ========================
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'MESERO'] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'menuitem', component: MenuItemComponent },
      { path: 'product', component: ProductComponent },
      { path: 'order', component: OrderComponent },
      { path: 'order/:id', component: OrderComponent },
      { path: 'order-details/:id', component: OrderDetailsComponent },
      { path: 'orderregister', component: OrderRegisterComponent },
      { path: 'delivery', component: DeliveryComponent },
      { path: 'delivery/new', component: DeliveryRegisterComponent },
      { path: 'orderitem', component: OrderItemComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'reservation', component: ReservationComponent },
      { path: 'role', component: RoleComponent },
      { path: 'table', component: TableComponent },
      { path: 'user', component: UserComponent }
    ]
  },

  // ========================
  // 🔐 Autenticación
  // ========================
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Página de acceso denegado
{ path: 'access-denied', component: AccessDenied },

  // ========================
  // ❌ Fallback
  // ========================
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }