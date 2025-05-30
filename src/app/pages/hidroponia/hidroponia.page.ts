import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/devices.service';
import { ActivatedRoute } from '@angular/router';
import { Device } from '../../models/device';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-hidroponia',
  templateUrl: './hidroponia.page.html',
  styleUrls: ['./hidroponia.page.scss'],
  standalone: false,
})
export class HidroponiaPage implements OnInit {

  id: string | null = null;

  device!: Device;

  interval: any;

  constructor(private devicesService: DevicesService, private route: ActivatedRoute, private toastController: ToastController) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.getDeviceDetails();

    // Atualiza os dados a cada 10 segundos
    this.interval = setInterval(() => {
      this.getDeviceDetails();
    }, 1000); // 10 segundos
  }

  ngOnDestroy() {
    clearInterval(this.interval); // Para o intervalo quando a página for destruída
  }

  async getDeviceDetails() {
    if (this.id) {
      try {
        const response = await this.devicesService.getDeviceDetails(this.id);
        response.subscribe(
          (data) => {
            this.device = data;
          },
        );
      } catch (error: any) {
        let errorMessage = 'Ocorreu um erro, não foi possível carregar os dispositivos.';

        if (error.error?.msg) {
          errorMessage = error.error.msg;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        const toast = await this.toastController.create({
          message: `${errorMessage}`,
          duration: 2000,
          color: 'danger',
          position: 'top',
          positionAnchor: 'menuC',
        });
        await toast.present();
      }
    }
  }

  getLastMeasure() {
    if (this.device?.measures?.length) {
      return this.device.measures[this.device.measures.length - 1];
    }
    return null;
  }

  isDayTime(timestamp: string | Date):boolean {
    const date = new Date(timestamp);
    const hour = date.getHours();
    if(hour >= 6 && hour < 18){
      return true
    }else{
      return false
    }
  }

  setDefaultImage(event: any) {
    event.target.src = '../../assets/img/default_hidroponia.png'; // Caminho da imagem padrão
  }

}

/*
async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');  // 'id' é o nome do parâmetro da URL
    console.log(this.id);

    this.devicesService.getDeviceDetails(this.id!).then(response => {
      response.subscribe(
        (data) => {
          this.device = data;
          console.log(this.device);
        },
        (error) => {
          console.error('Erro ao obter dispositivo', error);
        }
      );
    });
  }
*/
