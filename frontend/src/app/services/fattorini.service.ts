import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';
import { Fattorino, FattorinoForm } from '../models/models';

@Injectable({ providedIn: 'root' })
export class FattoriniService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(disponibile?: number): Observable<Fattorino[]> {
    let params = new HttpParams();
    if (disponibile !== undefined) params = params.set('disponibile', disponibile);
    return this.http.get<Fattorino[]>(`${this.base}/fattorini`, { params });
  }

  getById(id: number): Observable<Fattorino> {
    return this.http.get<Fattorino>(`${this.base}/fattorini/${id}`);
  }

  create(data: FattorinoForm): Observable<any> {
    return this.http.post(`${this.base}/fattorini`, data);
  }

  update(id: number, data: Partial<FattorinoForm>): Observable<any> {
    return this.http.put(`${this.base}/fattorini/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/fattorini/${id}`);
  }
}