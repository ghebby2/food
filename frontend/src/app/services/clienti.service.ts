import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';
import { Cliente, ClienteForm } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ClientiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(nome?: string): Observable<Cliente[]> {
    let params = new HttpParams();
    if (nome) params = params.set('nome', nome);
    return this.http.get<Cliente[]>(`${this.base}/clienti`, { params });
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.base}/clienti/${id}`);
  }

  create(data: ClienteForm): Observable<any> {
    return this.http.post(`${this.base}/clienti`, data);
  }

  update(id: number, data: Partial<ClienteForm>): Observable<any> {
    return this.http.put(`${this.base}/clienti/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/clienti/${id}`);
  }
}