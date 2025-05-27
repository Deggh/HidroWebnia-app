import { Device } from './../models/device';
import { Injectable } from '@angular/core';
import { Injector } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  private apiUrl = 'https://hidrowebnia-api.onrender.com/api/devices';

  constructor(private authService: AuthService, private http: HttpClient, private injector: Injector,) { }

  private getLoginService(): AuthService {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }
    return this.authService;
  }

  async getDevices(): Promise<Observable<any[]>> {
    const token = await this.getLoginService().getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Device[]>(this.apiUrl, { headers })
  }

  async getDeviceDetails(id: string): Promise<Observable<Device>> {
    const token = await this.getLoginService().getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Device>(`${this.apiUrl}/detalhes/${id}`, { headers });
  }

  postDevice(formData: FormData): Observable<any> {
    return from(this.getLoginService().getToken()).pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        return this.http.post<any>(this.apiUrl, formData, { headers });
      })
    );
  }

  patchDevice(id: string, formData: FormData): Observable<any> {
    return from(this.getLoginService().getToken()).pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        return this.http.patch<any>(`${this.apiUrl}/${id}`, formData, { headers });
      })
    );
  }

  deleteDevice(id: string){
    return from(this.getLoginService().getToken()).pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
      })
    );
  }

  updateDevices() {
    return this.getDevices();
  }
}
