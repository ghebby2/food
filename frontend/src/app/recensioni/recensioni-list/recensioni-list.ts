import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecensioniService } from '../../services/recensioni.service';
import { RistorantiService } from '../../services/ristoranti.service';
import { Recensione, Ristorante } from '../../models/models';

@Component({
  selector: 'app-recensioni-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recensioni-list.html',
  styleUrls: ['./recensioni-list.css']
})
export class RecensioniListComponent implements OnInit {
  recensioni: Recensione[] = [];
  ristoranti: Ristorante[] = [];
  filtroRistorante: number | undefined;
  filtroVotoMin: number | undefined;
  loading = false;
  errore: string = '';

  constructor(
    private svc: RecensioniService,
    private svcR: RistorantiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.svcR.getAll().subscribe({ next: (r) => (this.ristoranti = r) });
    this.carica();
  }

  carica(): void {
    this.loading = true;
    this.svc.getAll(this.filtroRistorante, this.filtroVotoMin).subscribe({
      next: (data) => { this.recensioni = data; this.loading = false; },
      error: () => { this.errore = 'Errore caricamento recensioni'; this.loading = false; }
    });
  }

  resetFiltri(): void {
    this.filtroRistorante = undefined;
    this.filtroVotoMin = undefined;
    this.carica();
  }

  nuova(): void { this.router.navigate(['/recensioni/nuova']); }

  modifica(id: number, e: Event): void {
    e.stopPropagation();
    this.router.navigate(['/recensioni', id, 'modifica']);
  }

  elimina(id: number, e: Event): void {
    e.stopPropagation();
    if (!confirm('Eliminare questa recensione?')) return;
    this.svc.delete(id).subscribe({
      next: () => this.carica(),
      error: (err) => (this.errore = err.error?.error || 'Errore durante l\'eliminazione')
    });
  }

  stelle(voto: number): string {
    return '★'.repeat(voto) + '☆'.repeat(5 - voto);
  }
}
