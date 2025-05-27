import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, private toastController: ToastController, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token']; // Aqui estamos acessando o token da URL
    });
  }

  token: string = '';

  newPassword = ''
  confirmNewPassword = ''

  async changePassword(){
    if (this.newPassword !== this.confirmNewPassword) {
      const toast = await this.toastController.create({
        message: 'As senhas são diferentes.',
        duration: 3000, // 3 segundos
        color: 'danger',
        position: 'top',
        positionAnchor: 'menuS',
      });
      await toast.present();
    } else if (this.newPassword.length < 8) {
      const toast = await this.toastController.create({
        message: 'A senha deve ter pelo menos 8 caracteres.',
        duration: 3000,
        color: 'danger',
        position: 'top',
        positionAnchor: 'menuS',
      });
      await toast.present();
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword)) {
      const toast = await this.toastController.create({
        message: 'A senha deve conter pelo menos 1 caractere especial.',
        duration: 3000,
        color: 'danger',
        position: 'top',
        positionAnchor: 'menuS',
      });
      await toast.present();
    } else {
      try {
        const response = await firstValueFrom(this.authService.resetPassword(this.token, this.newPassword, this.confirmNewPassword));

        const toast = await this.toastController.create({
          message: `${response.msg}`,
          duration: 3000,
          color: 'success',
          position: 'top',
          positionAnchor: 'menuS',
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
          positionAnchor: 'menuS',
        });
        await toast.present();
      }
    }
  }
}
