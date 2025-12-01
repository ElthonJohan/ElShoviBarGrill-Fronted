import { Component } from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { CartWidgetComponent } from "../../components/cart-widget/cart-widget.component";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from '../../services/auth-service';
import { MatMenu, MatMenuModule } from "@angular/material/menu";

@Component({
  selector: 'app-public-layout-component',
  imports: [MatToolbar, MatIcon, CartWidgetComponent, RouterModule, MatMenuModule],
  templateUrl: './public-layout-component.html',
  styleUrl: './public-layout-component.css',
})
export class PublicLayoutComponent {
  userName: string = '';
      
    constructor(private auth: AuthService, private router: Router) {}
  
    ngOnInit() {
      this.userName = this.auth.getUserName();
    }

      logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
