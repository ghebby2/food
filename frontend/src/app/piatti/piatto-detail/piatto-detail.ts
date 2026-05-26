import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PiattiService } from '../../services/piatti.service';
import { Piatto, Ingrediente } from '../../models/models';

@Component({
  selector: 'app-piatto-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './piatto-detail.html',
  styleUrls: ['./piatto-detail.css']
})
export class PiattoDetailComponent implements OnInit {
  piatto: Piatto | null = null;
  tuttiIngredienti: Ingrediente[] = [];
  nuovoIngredienteId: number = 0;
  loading = true;
  errore: string = '';
  successo: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: PiattiService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.caricaPiatto(id);
    this.svc.getIngredienti().subscribe({ next: (i) => (this.tuttiIngredienti = i) });
  }

  caricaPiatto(id: number): void {
    this.svc.getById(id).subscribe({
      next: (p) => { this.piatto = p; this.loading = false; },
      error: () => { this.errore = 'Piatto non trovato'; this.loading = false; }
    });
  }

  aggiungiIngrediente(): void {
    if (!this.nuovoIngredienteId) return;
    this.svc.addIngredienteToPiatto(this.piatto!.id_piatto, this.nuovoIngredienteId).subscribe({
      next: () => {
        this.successo = 'Ingrediente aggiunto!';
        this.nuovoIngredienteId = 0;
        this.caricaPiatto(this.piatto!.id_piatto);
        setTimeout(() => (this.successo = ''), 2000);
      },
      error: (err) => (this.errore = err.error?.error || 'Errore')
    });
  }

  rimuoviIngrediente(id_ingrediente: number): void {
    if (!confirm('Rimuovere questo ingrediente?')) return;
    this.svc.removeIngredienteFromPiatto(this.piatto!.id_piatto, id_ingrediente).subscribe({
      next: () => this.caricaPiatto(this.piatto!.id_piatto),
      error: () => (this.errore = 'Errore nella rimozione')
    });
  }

  ingredientiDisponibili(): Ingrediente[] {
    const presenti = (this.piatto?.ingredienti || []).map(i => i.id_ingrediente);
    return this.tuttiIngredienti.filter(i => !presenti.includes(i.id_ingrediente));
  }

  modifica(): void {
    this.router.navigate(['/piatti', this.piatto!.id_piatto, 'modifica']);
  }

  indietro(): void {
    this.router.navigate(['/piatti']);
  }
}
