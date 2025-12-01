import { Component } from '@angular/core';
import { AppRoutingModule } from "../../app.routes";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  imports: [
    RouterLink
  ],
  templateUrl: './access-denied.html',
  styleUrl: './access-denied.css',
})
export class AccessDenied {

}
