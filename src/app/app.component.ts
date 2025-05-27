import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {
    this.checkLogin();
  }

  async checkLogin() {
    const loggedIn = await this.authService.isLoggedIn();
    if (loggedIn) {
      this.router.navigate(['/home']); // Redireciona se estiver logado
    } else {
      this.router.navigate(['/login']); // Redireciona para o login se não estiver logado
    }
  }

}
