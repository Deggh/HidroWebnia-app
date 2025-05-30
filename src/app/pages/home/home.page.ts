import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private authService: AuthService, private router: Router, private toastController: ToastController) {}

  isDropdownOpen = false;

  toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
  }

  async logout() {
    try {
      await this.authService.logout(); // Garante que o token foi removido

      const message = 'Conta desconectada';

      const toast = await this.toastController.create({
        message: message,
        duration: 500,
        color: 'success',
        position: 'top',
        positionAnchor: 'menu',
      });
      await toast.present();

      this.router.navigate(['/login']); // Só redireciona depois que o token foi removido
    } catch (error: any) {
      const errorMessage = error.error?.msg || error.error?.message || 'Erro ao desconectar, tente novamente.';

      const toast = await this.toastController.create({
        message: `${errorMessage}`,
        duration: 2000,
        color: 'danger',
        position: 'top',
        positionAnchor: 'menu',
      });
      await toast.present();
    }
  }
}
