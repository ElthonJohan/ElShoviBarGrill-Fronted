import { Routes } from '@angular/router';
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


export const routes: Routes = [

   // Ruta inicial: redirige a home
  { path: '', redirectTo: 'home', pathMatch: 'full' },


  // Layout para clientes (solo CLIENTE)
  {
    path: '',
    component: ClienteLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'ordenes', component: OrderComponent },
      //{ path: 'perfil', component: PerfilClienteComponent }
    ]
  },
  // Layout para administradores y empleados
  {
    path: '',
    component: LayoutComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'MESERO'] },
    children: [
      { path: 'pages/dashboard', component: DashboardComponent },
    { path: 'pages/carrito', component: carritoComponent },
  { path: 'pages/category', component: CategoryComponent },
  { path: 'pages/menuitem', component: MenuItemComponent },
  { path: 'pages/product', component: ProductComponent },
  { path: 'pages/order', component: OrderComponent },
  { path: 'pages/order/:id', component: OrderComponent },
  {path: 'pages/order-details/:id', component: OrderDetailsComponent},

  { path: 'pages/orderregister', component: OrderRegisterComponent },
  { path: 'pages/delivery', component: DeliveryComponent },
  { path: 'pages/delivery/new', component: DeliveryRegisterComponent },

  { path: 'pages/orderitem', component: OrderItemComponent },
  { path: 'pages/payment', component: PaymentComponent },
  { path: 'pages/reservation', component: ReservationComponent },
  { path: 'pages/role', component: RoleComponent },
  { path: 'pages/table', component: TableComponent },
  { path: 'pages/user', component: UserComponent },
      // otras rutas
    ]
  },

  // Home público
  // { path: 'home', component: HomeComponent },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Pages
  // { path: 'pages/dashboard', component: DashboardComponent },
  //   { path: 'pages/carrito', component: carritoComponent },
  // { path: 'pages/category', component: CategoryComponent },
  // { path: 'pages/menuitem', component: MenuItemComponent },
  // { path: 'pages/product', component: ProductComponent },
  // { path: 'pages/order', component: OrderComponent },
  // { path: 'pages/order/:id', component: OrderComponent },
  // {path: 'pages/order-details/:id', component: OrderDetailsComponent},

  // { path: 'pages/orderregister', component: OrderRegisterComponent },
  // { path: 'pages/delivery', component: DeliveryComponent },
  // { path: 'pages/delivery/new', component: DeliveryRegisterComponent },

  // { path: 'pages/orderitem', component: OrderItemComponent },
  // { path: 'pages/payment', component: PaymentComponent },
  // { path: 'pages/reservation', component: ReservationComponent },
  // { path: 'pages/role', component: RoleComponent },
  // { path: 'pages/table', component: TableComponent },
  // { path: 'pages/user', component: UserComponent },

  // Ruta por defecto
  // { path: '', redirectTo: '/home', pathMatch: 'full' },

  // // Not found
  // { path: '**', redirectTo: '/home' },
];
