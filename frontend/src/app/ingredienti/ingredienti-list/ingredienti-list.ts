import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PiattiService } from '../../services/piatti.service';
import { Ingrediente } from '../../models/models';

@Component({
  selector: 'app-ingredienti-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ingredienti-list.html',
  styleUrls: ['./ingredienti-list.css']
})
export class IngredientiListComponent implements OnInit {
  ingredienti: Ingrediente[] = [];
  filtroAllergenico: string = '';
  loading = false;
  errore: string = '';

  constructor(private svc: PiattiService, private router: Router) {}

  ngOnInit(): void { this.carica(); }

  carica(): void {
    this.loading = true;
    const allergenico = this.filtroAllergenico !== '' ? Number(this.filtroAllergenico) : undefined;
    this.svc.getIngredienti(allergenico).subscribe({
      next: (data) => { this.ingredienti = data; this.loading = false; },
      error: () => { this.errore = 'Errore caricamento ingredienti'; this.loading = false; }
    });
  }

  nuovo(): void { this.router.navigate(['/ingredienti/nuovo']); }

  modifica(id: number, e: Event): void {
    e.stopPropagation();
    this.router.navigate(['/ingredienti', id, 'modifica']);
  }

  elimina(id: number, e: Event): void {
    e.stopPropagation();
    if (!confirm('Eliminare questo ingrediente?')) return;
    this.svc.deleteIngrediente(id).subscribe({ next: () => this.carica() });
  }
}
