import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private authService: AuthService, private router: Router) {}

  isDropdownOpen = false;

  toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
  }

  async logout() {
    try {
      await this.authService.logout(); // Garante que o token foi removido
      console.log('Token removido com sucesso');
      this.router.navigate(['/login']); // Só redireciona depois que o token foi removido
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
}
