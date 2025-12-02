import { Component } from '@angular/core';
import { MatToolbar, MatToolbarModule } from "@angular/material/toolbar";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { CartWidgetComponent } from "../../components/cart-widget/cart-widget.component";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from '../../services/auth-service';
import { MatMenu, MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-public-layout-component',
  imports: [
    RouterModule, 
    MatIconModule,
     MatToolbarModule,
      CartWidgetComponent, 
      MatMenu, 
      MatMenuTrigger
      ],
  templateUrl: './public-layout-component.html',
  styleUrl: './public-layout-component.css',
})
export class PublicLayoutComponent {
  userName: string = '';
    cartItemCount: number = 0; // cantidad inicial del carrito
    constructor(private auth: AuthService,private router: Router) {}
  
    ngOnInit() {
      this.userName = this.auth.getUserName();
    }

      logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
