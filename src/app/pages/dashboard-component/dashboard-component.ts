import { AfterViewInit, Component } from '@angular/core';
import { DashboardService, DashboardStats, VentasDiarias, CategoriaVentas, MetodoPago, VentasPorUsuario } from '../../services/dashboard-service';
import Chart from 'chart.js/auto';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.css']
})
export class DashboardComponent implements AfterViewInit {

  // Tarjetas
  stats: DashboardStats = {
    ventasHoy: 0,
    pedidosActivos: 0,
    clientesHoy: 0,
    reservasHoy: 0
  };

  // Referencias a gráficos (para poder destruir si recargas)
  ventasChart?: Chart;
  categoriasChart?: Chart;
  metodosPagoChart?: Chart;
  ventasUsuarioChart?: Chart;

  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngAfterViewInit(): void {
    this.cargarDashboard();
  }

  private aplicarEstiloCharts() {
    const isDark = document.body.classList.contains('dark-theme');
    Chart.defaults.color = isDark ? '#ffffff' : '#333333';
    Chart.defaults.borderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
  }

  cargarDashboard() {
    this.aplicarEstiloCharts();

   // 1. Cargar stats
    this.dashboardService.getStats().subscribe({
      next: data => this.stats = data
    });

    // 2. Ventas diarias
    this.dashboardService.getVentasDiarias().subscribe({
      next: data => setTimeout(() =>
        this.crearVentasChart(data), 100)
    });

    // 3. Categorías
    this.dashboardService.getCategoriasMasVendidas().subscribe({
      next: data => setTimeout(() =>
        this.crearCategoriasChart(data), 100)
    });

    // 4. Métodos de pago
    this.dashboardService.getMetodosPago().subscribe({
      next: data => setTimeout(() =>
        this.crearMetodosPagoChart(data), 100)
    });

    // 5. Ventas por usuario
    this.dashboardService.getVentasPorUsuario().subscribe({
      next: data => {
        setTimeout(() =>
          this.crearVentasUsuarioChart(data), 100);

        this.loading = false;
      }
    });
  }



  // =================== GRÁFICOS ===================

  
  private crearVentasChart(data: VentasDiarias[]) {
    if (this.ventasChart) this.ventasChart.destroy();

    this.ventasChart = new Chart('ventasChart', {
      type: 'line',
      data: {
        labels: data.map(d => d.fecha).reverse(),
        datasets: [{
          label: 'Ventas (S/)',
          data: data.map(d => d.total).reverse(),
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }]
      }
    });
  }

  private crearCategoriasChart(data: CategoriaVentas[]) {
    if (this.categoriasChart) this.categoriasChart.destroy();

    this.categoriasChart = new Chart('categoriasChart', {
      type: 'bar',
      data: {
        labels: data.map(d => d.categoria),
        datasets: [{
          label: 'Cantidad vendida',
          data: data.map(d => d.cantidadVendida),
          borderWidth: 1
        }]
      }
    });
  }

  private crearMetodosPagoChart(data: MetodoPago[]) {
    if (this.metodosPagoChart) this.metodosPagoChart.destroy();

    this.metodosPagoChart = new Chart('metodosPagoChart', {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.metodo),
        datasets: [{
          data: data.map(d => d.total)
        }]
      }
    });
  }

  private crearVentasUsuarioChart(data: VentasPorUsuario[]) {
    if (this.ventasUsuarioChart) this.ventasUsuarioChart.destroy();

    this.ventasUsuarioChart = new Chart('ventasUsuarioChart', {
      type: 'bar',
      data: {
        labels: data.map(d => d.usuario),
        datasets: [{
          data: data.map(d => d.total),
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y'
      }
    });
  }
}
