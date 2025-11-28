import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category-service';
import { Category } from '../../model/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css']
})
export class HomeComponent implements OnInit {

  categories: Category[] = [];
  loading = true;
  error = false;

  activeCardIndex = 0;

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}
  heroImages = [
  "https://i.postimg.cc/J43kGgjB/principal.jpg",
  "https://i.postimg.cc/J0YdJqyy/bartender.webp",
  "https://i.postimg.cc/xTqZQW7y/carne.jpg"
];

currentImage = 0;

testimonials = [
  { text: 'La mejor parrilla de Cajamarca. Ambiente espectacular.', author: 'Elthon G.' },
  { text: 'Volvería mil veces. Atención A1 y comida deliciosa.', author: 'Juan C.' },
  { text: 'Los tragos y la música hacen que la noche sea perfecta.', author: 'Edu C.' }
];

currentTestimonial = 0;
currentYear = new Date().getFullYear();

  ngOnInit(): void {
    setInterval(() => {
    this.currentImage = (this.currentImage + 1) % this.heroImages.length;
  }, 5000);
  setInterval(() => {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
  }, 10000);
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


  // ----- Navegación a categorías y menú -----
  goToCategory(id: number) {
    this.router.navigate(['/pages/menuitem'], { queryParams: { categoryId: id } });
  }

  goToMenu() {
    this.router.navigate(['/pages/menuitem']);
  }
}
