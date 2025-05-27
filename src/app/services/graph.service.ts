import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private baseUrl = 'https://hidrowebnia-api.onrender.com';

   constructor(private http: HttpClient) { }

  getDayData(id: string, fields: string) {
    return this.http.get(`${this.baseUrl}/api/graphics/measures/${id}/day?fields=${fields}`);
  }

  getWeekData(id: string, fields: string) {
    return this.http.get(`${this.baseUrl}/api/graphics/measures/${id}/week?fields=${fields}`);
  }

  getMonthData(id: string, fields: string) {
    return this.http.get(`${this.baseUrl}/api/graphics/measures/${id}/month?fields=${fields}`);
  }
}
