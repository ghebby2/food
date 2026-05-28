import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PiattiService } from '../../services/piatti.service';
import { RistorantiService } from '../../services/ristoranti.service';
import { Piatto, Ristorante } from '../../models/models';

@Component({
  selector: 'app-piatti-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './piatti-list.html',
  styleUrls: ['./piatti-list.css']
})
export class PiattiListComponent implements OnInit {
  piatti: Piatto[] = [];
  ristoranti: Ristorante[] = [];
  filtroNome: string = '';
  filtroRistorante: number | undefined;
  filtroDisponibile: string = '';
  loading = false;
  errore: string = '';

  constructor(
    private svc: PiattiService,
    private svcR: RistorantiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.svcR.getAll().subscribe({ next: (r) => (this.ristoranti = r) });
    this.caricaPiatti();
  }

  caricaPiatti(): void {
    this.loading = true;
    const disp = this.filtroDisponibile !== '' ? Number(this.filtroDisponibile) : undefined;
    this.svc.getAll(this.filtroNome, this.filtroRistorante, disp).subscribe({
      next: (data) => { this.piatti = data; this.loading = false; },
      error: () => { this.errore = 'Errore caricamento piatti'; this.loading = false; }
    });
  }

  cerca(): void { this.caricaPiatti(); }

  resetFiltri(): void {
    this.filtroNome = '';
    this.filtroRistorante = undefined;
    this.filtroDisponibile = '';
    this.caricaPiatti();
  }

  apriDettaglio(id: number): void { this.router.navigate(['/piatti', id]); }

  elimina(id: number, event: Event): void {
    event.stopPropagation();
    if (!confirm('Eliminare questo piatto?')) return;
    this.svc.delete(id).subscribe({
      next: () => this.caricaPiatti(),
      error: (err) => (this.errore = err.error?.error || 'Errore durante l\'eliminazione')
    });
  }

  nuovo(): void { this.router.navigate(['/piatti/nuovo']); }
}
