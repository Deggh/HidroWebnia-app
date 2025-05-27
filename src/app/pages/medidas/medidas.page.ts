import { ViewWillEnter, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/devices.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medidas',
  templateUrl: './medidas.page.html',
  styleUrls: ['./medidas.page.scss'],
  standalone: false,
})
export class MedidasPage implements OnInit, ViewWillEnter {

  devices: any[] | null = null;

  constructor(private authService: AuthService, private router: Router, private devicesService: DevicesService, private toastController: ToastController) { }

  async ngOnInit() {
    await this.loadDevices();
  }

  async ionViewWillEnter() {
    await this.loadDevices(); // Chama a função sempre que a página for aberta
  }

  async loadDevices() {
    try {
      const devicesObservable = await this.devicesService.getDevices();
      devicesObservable.subscribe(data => {
        this.devices = data;
      });
    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro. Tente novamente.';

      if (error.error?.msg) {
        errorMessage = error.error.msg;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      const toast = await this.toastController.create({
        message: `${errorMessage}`,
        duration: 3000,
        color: 'danger',
        position: 'top',
        positionAnchor: 'menuM',
      });
      await toast.present();
    }
  }

  isDropdownOpen = false;
  toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
  }

  setDefaultImage(event: any) {
    event.target.src = '../../assets/img/default_hidroponia.png'; // Caminho da imagem padrão
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
}
