import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';
import { Ordine, OrdineForm } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrdiniService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(id_cliente?: number, stato?: string): Observable<Ordine[]> {
    let params = new HttpParams();
    if (id_cliente) params = params.set('id_cliente', id_cliente);
    if (stato) params = params.set('stato', stato);
    return this.http.get<Ordine[]>(`${this.base}/ordini`, { params });
  }

  getById(id: number): Observable<Ordine> {
    return this.http.get<Ordine>(`${this.base}/ordini/${id}`);
  }

  create(data: OrdineForm): Observable<any> {
    return this.http.post(`${this.base}/ordini`, data);
  }

  update(id: number, data: { stato?: string; id_fattorino?: number }): Observable<any> {
    return this.http.put(`${this.base}/ordini/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/ordini/${id}`);
  }
}