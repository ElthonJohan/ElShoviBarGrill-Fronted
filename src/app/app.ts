import { Component, signal } from '@angular/core';
import { LayoutComponent } from './pages/layout-component/layout-component';
import { RegisterComponent } from "./pages/register-component/register-component";
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [LayoutComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] 
})
export class App {
  protected readonly title = signal('appointmentapp-frontend');


}
