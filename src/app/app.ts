import { Component, signal } from '@angular/core';
import { LayoutComponent } from './pages/layout-component/layout-component';
import { RegisterComponent } from "./pages/register-component/register-component";

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [LayoutComponent, RegisterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] 
})
export class App {
  protected readonly title = signal('appointmentapp-frontend');
}
