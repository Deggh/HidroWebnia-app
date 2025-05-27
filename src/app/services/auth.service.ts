import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://hidrowebnia-api.onrender.com/api/auth'; // URL da API

  constructor(private http: HttpClient, private storage: Storage) {
    this.storage.create();
  }

  register(username: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { username, email, password, confirmPassword});
  }

  // Método para fazer login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  // Salvar token no Storage
  async saveToken(token: string) {
    await this.storage.set('token', token);
  }

  // Buscar token salvo
  async getToken() {
    return await this.storage.get('token');
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token; // Retorna true se o token existir, false se não existir
  }

  // Remover token (logout)
  async logout() {
    await this.storage.remove('token');
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { email });
  }

  resetPassword(token: string, newPassword: string, confirmNewPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password/${token}`, { newPassword, confirmNewPassword });
  }
}
