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

export const routes: Routes = [
  //  Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Pages
  { path: 'pages/category', component: CategoryComponent },
  { path: 'pages/menuitem', component: MenuItemComponent },
  { path: 'pages/order', component: OrderComponent },
  { path: 'pages/delivery', component: DeliveryComponent },
  { path: 'pages/orderitem', component: OrderItemComponent },
  { path: 'pages/payment', component: PaymentComponent },
  { path: 'pages/reservation', component: ReservationComponent },
  { path: 'pages/role', component: RoleComponent },
  { path: 'pages/table', component: TableComponent },
  { path: 'pages/user', component: UserComponent },

  // Ruta por defecto
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: '**', redirectTo: '/login' },
];
