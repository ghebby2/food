import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';
import { Piatto, PiattoForm, Ingrediente, IngredienteForm } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PiattiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(nome?: string, id_ristorante?: number, disponibile?: number): Observable<Piatto[]> {
    let params = new HttpParams();
    if (nome) params = params.set('nome', nome);
    if (id_ristorante) params = params.set('id_ristorante', id_ristorante);
    if (disponibile !== undefined) params = params.set('disponibile', disponibile);
    return this.http.get<Piatto[]>(`${this.base}/piatti`, { params });
  }

  getById(id: number): Observable<Piatto> {
    return this.http.get<Piatto>(`${this.base}/piatti/${id}`);
  }

  create(data: PiattoForm): Observable<any> {
    return this.http.post(`${this.base}/piatti`, data);
  }

  update(id: number, data: Partial<PiattoForm>): Observable<any> {
    return this.http.put(`${this.base}/piatti/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/piatti/${id}`);
  }

  // Ingredienti
  getIngredienti(allergenico?: number): Observable<Ingrediente[]> {
    let params = new HttpParams();
    if (allergenico !== undefined) params = params.set('allergenico', allergenico);
    return this.http.get<Ingrediente[]>(`${this.base}/ingredienti`, { params });
  }

  getIngrediente(id: number): Observable<Ingrediente> {
    return this.http.get<Ingrediente>(`${this.base}/ingredienti/${id}`);
  }

  createIngrediente(data: IngredienteForm): Observable<any> {
    return this.http.post(`${this.base}/ingredienti`, data);
  }

  updateIngrediente(id: number, data: IngredienteForm): Observable<any> {
    return this.http.put(`${this.base}/ingredienti/${id}`, data);
  }

  deleteIngrediente(id: number): Observable<any> {
    return this.http.delete(`${this.base}/ingredienti/${id}`);
  }

  addIngredienteToPiatto(id_piatto: number, id_ingrediente: number): Observable<any> {
    return this.http.post(`${this.base}/piatti/${id_piatto}/ingredienti`, { id_ingrediente });
  }

  removeIngredienteFromPiatto(id_piatto: number, id_ingrediente: number): Observable<any> {
    return this.http.delete(`${this.base}/piatti/${id_piatto}/ingredienti/${id_ingrediente}`);
  }
}