import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GraphService } from 'src/app/services/graph.service';
import { Chart, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.page.html',
  styleUrls: ['./graph.page.scss'],
  standalone: false,
})
export class GraphPage implements OnInit, AfterViewInit {

  fields = [
    { key: 'temperature', label: 'Temperatura' },
    { key: 'umidity', label: 'Umidade' },
    { key: 'pH', label: 'pH' },
    { key: 'uv', label: 'UV' },
    { key: 'conductivity', label: 'Condutividade' }
  ];

  selectedField = 'temperature';

  id: string | null = null;

  private dailyChart: any;
  private weeklyChart: any;
  private monthlyChart: any;

  constructor(
    private graphService: GraphService,
    private route: ActivatedRoute
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngAfterViewInit() {
    this.loadCharts(this.selectedField);
  }

  selectField(field: string) {
    this.selectedField = field;
    this.loadCharts(field);
  }

  /**
   * Função para obter o label em português
   */
  getFieldLabel(field: string): string {
    const f = this.fields.find(item => item.key === field);
    return f ? f.label : field;
  }

  loadCharts(field: string) {
    if (!this.id) return;

    const label = this.getFieldLabel(field);

    this.graphService.getDayData(this.id, field).subscribe((res: any) => {
      const labels = res.map((m: any) => new Date(m.timestamp).toLocaleTimeString()).reverse();
      const data = res.map((m: any) => m[field]).reverse();
      this.createChart('daily', labels, data, `${label} - Diário`);
    });

    this.graphService.getWeekData(this.id, field).subscribe((res: any) => {
      const labels = res.map((m: any) => new Date(m.timestamp).toLocaleDateString()).reverse();
      const data = res.map((m: any) => m[field]).reverse();
      this.createChart('weekly', labels, data, `${label} - Semanal`);
    });

    this.graphService.getMonthData(this.id, field).subscribe((res: any) => {
      const labels = res.map((m: any) => new Date(m.timestamp).toLocaleDateString()).reverse();
      const data = res.map((m: any) => m[field]).reverse();
      this.createChart('monthly', labels, data, `${label} - Mensal`);
    });
  }

  createChart(canvasId: string, labels: string[], data: number[], label: string) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 12   // ✅ Fonte menor da legenda
              }
            }
          },
          title: {
            display: true,
            text: label,
            font: {
              size: 14   // ✅ Fonte menor do título
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 11   // ✅ Fonte menor do eixo X
              }
            }
          },
          y: {
            ticks: {
              font: {
                size: 11   // ✅ Fonte menor do eixo Y
              }
            }
          }
        }
      }
    });
  }
}
