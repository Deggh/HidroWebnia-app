import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GraphService } from 'src/app/services/graph.service';
import { Chart, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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

  unitMap: { [key: string]: string } = {
    temperature: '°C',
    umidity: '%',
    pH: '',             // ou 'pH'
    uv: 'mW/cm²',       // ou conforme o sensor
    conductivity: 'µS/cm'
  };

  constructor(
    private graphService: GraphService,
    private route: ActivatedRoute
  ) {
    Chart.register(...registerables, ChartDataLabels);
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

  /**
   * Função para obter a unidade de medida
   */
  getUnit(field: string): string {
    return this.unitMap[field] || '';
  }

  getColor(field: string): string {
    switch (field) {
      case 'temperature':
        return 'rgba(255, 99, 132, 1)';   // Vermelho
      case 'umidity':
        return 'rgba(54, 162, 235, 1)';   // Azul
      case 'pH':
        return 'rgba(75, 192, 192, 1)';   // Amarelo
      case 'uv':
        return 'rgba(153, 102, 255, 1)';  // Roxo
      case 'conductivity':
        return 'rgba(255, 206, 86, 1)';   // Verde-água
      default:
        return 'rgba(201, 203, 207, 1)';  // Cinza
    }
  }


  loadCharts(field: string) {
    if (!this.id) return;

    const label = this.getFieldLabel(field);
    const unit = this.getUnit(field);

    this.graphService.getDayData(this.id, field).subscribe((res: any) => {
      const labels = res.map((m: any) => new Date(m.timestamp).toLocaleTimeString()).reverse();
      const data = res.map((m: any) => m[field]).reverse();
      this.createChart('daily', labels, data, `${label} (${unit}) - Diário`);
    });

    this.graphService.getWeekData(this.id, field).subscribe((res: any) => {
      const labels = res.map((m: any) => new Date(m.timestamp).toLocaleDateString()).reverse();
      const data = res.map((m: any) => m[field]).reverse();
      this.createChart('weekly', labels, data, `${label} (${unit}) - Semanal`);
    });

    this.graphService.getMonthData(this.id, field).subscribe((res: any) => {
      const groupedData: { [key: string]: number[] } = {};

      // Agrupa os valores por dia
      for (let i = 0; i < res.length; i++) {
        const m = res[i];
        const date = new Date(m.timestamp).toLocaleDateString();

        if (!groupedData[date]) {
          groupedData[date] = [];
        }
        groupedData[date].push(m[field]);
      }

      const labels: string[] = [];
      const data: number[] = [];

      // Para cada dia, calcula a média corretamente
      for (const date in groupedData) {
        const values = groupedData[date];

        let sum = 0;
        for (let i = 0; i < values.length; i++) {
          sum += Number(values[i]);
        }

        const avg = sum / values.length;

        labels.push(date);
        data.push(parseFloat(avg.toFixed(1)));
      }

      // Inverte a ordem para ficar como você quer
      labels.reverse();
      data.reverse();

      this.createChart('monthly', labels, data, `${label} (${unit}) - Mensal`);
    });
  }

  createChart(canvasId: string, labels: string[], data: number[], label: string) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    const unit = this.getUnit(this.selectedField);
    const color = this.getColor(this.selectedField);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,

          borderColor: color,
          backgroundColor: color.replace('1)', '0.2)'),  // Mantém transparência

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
                size: 12
              }
            },
            onClick: () => {}
          },
          title: {
            display: true,
            text: label,
            font: {
              size: 14
            }
          },
          datalabels: {
            anchor: 'start',
            align: 'top',
            color: '#1f1f1f',
            font: {
              size: 10,
              weight: 'bold'
            },
            formatter: (value: number) => `${value.toFixed(1)}`
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 10
              }
            }
          },
          y: {
            ticks: {
              font: {
                size: 10
              }
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }
}
