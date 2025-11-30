import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatToolbar, MatToolbarModule } from "@angular/material/toolbar";

@Component({
  selector: 'app-cliente-layout-component',
  imports: [RouterModule, MatIconModule, MatToolbarModule],
  templateUrl: './cliente-layout-component.html',
  styleUrl: './cliente-layout-component.css',
})
export class ClienteLayoutComponent {

}
