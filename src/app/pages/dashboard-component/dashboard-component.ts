import { AfterViewInit, Component } from '@angular/core';
import { DashboardService, DashboardStats, VentasDiarias, CategoriaVentas, MetodoPago, VentasPorUsuario } from '../../services/dashboard-service';
import Chart from 'chart.js/auto';
import { MatIconModule } from '@angular/material/icon';
import { MatSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule,
    MatSpinner,
    CommonModule
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

    // 1. Stats
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats = data
    });

    // 2. Ventas diarias
    this.dashboardService.getVentasDiarias().subscribe({
      next: (data) => this.crearVentasChart(data)
    });

    // 3. Categorías más vendidas
    this.dashboardService.getCategoriasMasVendidas().subscribe({
      next: (data) => this.crearCategoriasChart(data)
    });

    // 4. Métodos de pago
    this.dashboardService.getMetodosPago().subscribe({
      next: (data) => this.crearMetodosPagoChart(data)
    });

    // 5. Ventas por usuario
    this.dashboardService.getVentasPorUsuario().subscribe({
      next: (data) => {
        this.crearVentasUsuarioChart(data);
        this.loading = false;
      }
    });
  }

  // =================== GRÁFICOS ===================

  private crearVentasChart(data: VentasDiarias[]) {
    if (this.ventasChart) this.ventasChart.destroy();

    const labels = data
      .map(d => d.fecha)
      .reverse(); // por si viene descendente

    const valores = data
      .map(d => d.total)
      .reverse();

    this.ventasChart = new Chart('ventasChart', {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Ventas (S/)',
          data: valores,
          tension: 0.4,
          borderWidth: 3,
          fill: true
        }]
      }
    });
  }

  private crearCategoriasChart(data: CategoriaVentas[]) {
    if (this.categoriasChart) this.categoriasChart.destroy();

    const labels = data.map(d => d.categoria);
    const valores = data.map(d => d.cantidadVendida);

    this.categoriasChart = new Chart('categoriasChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Cantidad vendida',
          data: valores,
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  private crearMetodosPagoChart(data: MetodoPago[]) {
    if (this.metodosPagoChart) this.metodosPagoChart.destroy();

    const labels = data.map(d => d.metodo);
    const valores = data.map(d => d.total);

    this.metodosPagoChart = new Chart('metodosPagoChart', {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: valores
        }]
      }
    });
  }

  private crearVentasUsuarioChart(data: VentasPorUsuario[]) {
    if (this.ventasUsuarioChart) this.ventasUsuarioChart.destroy();

    const labels = data.map(d => d.usuario);
    const valores = data.map(d => d.total);

    this.ventasUsuarioChart = new Chart('ventasUsuarioChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Ventas (S/)',
          data: valores,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // barras horizontales
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}
