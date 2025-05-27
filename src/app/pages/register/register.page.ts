import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {

  constructor(private authService: AuthService, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
  }

  isDropdownOpen = false;

  toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
  }

  username = ''
  email = ''
  password = ''
  confirmPassword = ''
  mostrarSenha = false;

  loading: boolean = false;

  async registerNewUser() {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
        const toast = await this.toastController.create({
            message: 'Todos os campos são obrigatórios!',
            duration: 3000,
            color: 'warning',
            position: 'top',
            positionAnchor: 'menuC',
        });
        await toast.present();
        return; // Interrompe a execução
    }

    if (this.password !== this.confirmPassword) {
        const toast = await this.toastController.create({
            message: 'As senhas não correspondem!',
            duration: 3000,
            color: 'warning',
            position: 'top',
            positionAnchor: 'menuC',
        });
        await toast.present();
        return; // Interrompe a execução
    }

    this.loading = true;
    try {
        const response = await firstValueFrom(
            this.authService.register(
                this.username,
                this.email.toLocaleLowerCase(),
                this.password,
                this.confirmPassword
            )
        );

        const toast = await this.toastController.create({
            message: `${response.msg}`,
            duration: 3000,
            color: 'success',
            position: 'top',
            positionAnchor: 'menuC',
        });
        this.loading = false;
        await toast.present();
        this.router.navigate(['/login']);
    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro. Tente novamente.';

      if (!error.error || error.status === 0) {
          errorMessage = 'API está temporariamente indisponível. Tente novamente mais tarde.';
      } else if (error.status === 503) {
          errorMessage = 'API está suspensa. Aguarde um momento e tente novamente.';
      } else if (Array.isArray(error.error)) {
          // Caso o backend retorne múltiplos erros como um array
          errorMessage = error.error.map((err: any) => err.msg || err.message).join(' | ');
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
            positionAnchor: 'menuC',
        });
        this.loading = false;
        await toast.present();
    }
  }
}
