import { ToastController } from '@ionic/angular';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  constructor(private authService: AuthService, private router: Router, private toastController: ToastController) { }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  mostrarSenha = false

  email: string = ''
  senha: string = ''

  loading: boolean = false;

  async login() {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.authService.login(this.email.toLocaleLowerCase(), this.senha));
      await this.authService.saveToken(response.token);

      const toast = await this.toastController.create({
        message: `${response.msg}`,
        duration: 3000,
        color: 'success',
        position: 'top',
        positionAnchor: 'menuL',
      });
      this.loading = false;
      await toast.present();
      this.router.navigate(['/home']);

    } catch (error: any) {
      // Exibir a mensagem detalhada de erro do backend
      let errorMessage = 'Ocorreu um erro. Tente novamente.';

      if (!error.error || error.status === 0) {
        errorMessage = 'API está temporariamente indisponível. Tente novamente mais tarde.';
      } else if (error.status === 503) {
        errorMessage = 'API está suspensa. Aguarde um momento e tente novamente.';
      } else if (error.error?.msg) {
        errorMessage = error.error.msg;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      const toast = await this.toastController.create({
        message: `${errorMessage}`,
        duration: 3000,
        color: 'danger',
        position: 'top',
        positionAnchor: 'menuL',
      });
      this.loading = false;
      await toast.present();
    }
  }

}

/*
try {
  const response = await firstValueFrom(this.authService.login(this.email, this.password));
  await this.authService.saveToken(response.token);

  const toast = await this.toastController.create({
    message: `${response.msg}`,
    duration: 3000,
    color: 'success',
    position: 'top',
  });
  await toast.present();
  this.router.navigate(['/login']);

} catch (error: any) {
  // Exibir a mensagem detalhada de erro do backend
  const errorMessage = error.error?.msg || error.error?.message || 'Ocorreu um erro. Tente novamente.';

  const toast = await this.toastController.create({
    message: `${errorMessage}`,
    duration: 3000,
    color: 'danger',
    position: 'top',
  });
  await toast.present();
}
*/
