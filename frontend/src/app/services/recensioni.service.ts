import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';
import { Recensione, RecensioneForm } from '../models/models';

@Injectable({ providedIn: 'root' })
export class RecensioniService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(id_ristorante?: number, voto_min?: number): Observable<Recensione[]> {
    let params = new HttpParams();
    if (id_ristorante) params = params.set('id_ristorante', id_ristorante);
    if (voto_min) params = params.set('voto_min', voto_min);
    return this.http.get<Recensione[]>(`${this.base}/recensioni`, { params });
  }

  getById(id: number): Observable<Recensione> {
    return this.http.get<Recensione>(`${this.base}/recensioni/${id}`);
  }

  create(data: RecensioneForm): Observable<any> {
    return this.http.post(`${this.base}/recensioni`, data);
  }

  update(id: number, data: { voto?: number; commento?: string }): Observable<any> {
    return this.http.put(`${this.base}/recensioni/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/recensioni/${id}`);
  }
}