import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false,
})
export class ForgotPasswordPage implements OnInit {

  constructor(private authService: AuthService, private toastController: ToastController) { }

  ngOnInit() {
  }

  email = ''

  loading: boolean = false;

  async forgotPassword(){
    this.loading = true;
    try {
      const response = await firstValueFrom(this.authService.forgotPassword(this.email.toLocaleLowerCase()))

      const toast = await this.toastController.create({
        message: `${response.msg}`,
        duration: 2000,
        color: 'success',
        position: 'top',
        positionAnchor: 'menuF',
      })
      this.loading = false;
      await toast.present()

    } catch (error: any) {
      // Exibir a mensagem detalhada de erro do backend
      const errorMessage = error.error?.message || 'Ocorreu um erro, tente novamente.'

      const toast = await this.toastController.create({
        message: `${errorMessage}`,
        duration: 2000,
        color: 'danger',
        position: 'top',
        positionAnchor: 'menuF',
      });
      this.loading = false;
      await toast.present()
    }
  }

}
