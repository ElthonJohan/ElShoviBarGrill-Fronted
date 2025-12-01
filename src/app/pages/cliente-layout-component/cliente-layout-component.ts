import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatToolbar, MatToolbarModule } from "@angular/material/toolbar";
import { CartWidgetComponent } from "../../components/cart-widget/cart-widget.component";
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-cliente-layout-component',
  imports: [RouterModule, MatIconModule, MatToolbarModule, CartWidgetComponent],
  templateUrl: './cliente-layout-component.html',
  styleUrl: './cliente-layout-component.css',
})
export class ClienteLayoutComponent {
    userName: string = '';
    
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.userName = this.auth.getUserName();
  }
}
