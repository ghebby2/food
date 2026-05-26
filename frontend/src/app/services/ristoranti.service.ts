import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';
import { Ristorante, RistoranteForm, Categoria } from '../models/models';

@Injectable({ providedIn: 'root' })
export class RistorantiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(nome?: string, id_categoria?: number): Observable<Ristorante[]> {
    let params = new HttpParams();
    if (nome) params = params.set('nome', nome);
    if (id_categoria) params = params.set('id_categoria', id_categoria);
    return this.http.get<Ristorante[]>(`${this.base}/ristoranti`, { params });
  }

  getById(id: number): Observable<Ristorante> {
    return this.http.get<Ristorante>(`${this.base}/ristoranti/${id}`);
  }

  create(data: RistoranteForm): Observable<any> {
    return this.http.post(`${this.base}/ristoranti`, data);
  }

  update(id: number, data: Partial<RistoranteForm>): Observable<any> {
    return this.http.put(`${this.base}/ristoranti/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/ristoranti/${id}`);
  }

  // Categorie
  getCategorie(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.base}/categorie`);
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.base}/categorie/${id}`);
  }

  createCategoria(data: { nome: string; descrizione?: string }): Observable<any> {
    return this.http.post(`${this.base}/categorie`, data);
  }

  updateCategoria(id: number, data: { nome: string; descrizione?: string }): Observable<any> {
    return this.http.put(`${this.base}/categorie/${id}`, data);
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.base}/categorie/${id}`);
  }
}