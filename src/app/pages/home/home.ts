import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category-service';
import { Category } from '../../model/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  categories: Category[] = [];
  loading = true;
  error = false;

  // ----- Horario como carrusel -----
  scheduleCards = [
    { days: 'Lunes a Viernes', hours: '12:00 pm - 11:00 pm' },
    { days: 'Sábados y Domingos', hours: '11:00 am - 12:00 am' }
  ];
  activeCardIndex = 0;

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.findAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  // ----- Navegación de las tarjetas de horario -----
  prevCard() {
    this.activeCardIndex = (this.activeCardIndex - 1 + this.scheduleCards.length) % this.scheduleCards.length;
  }

  nextCard() {
    this.activeCardIndex = (this.activeCardIndex + 1) % this.scheduleCards.length;
  }

  // ----- Navegación a categorías y menú -----
  goToCategory(id: number) {
    this.router.navigate(['/pages/menuitem'], { queryParams: { categoryId: id } });
  }

  goToMenu() {
    this.router.navigate(['/pages/menuitem']);
  }
}
