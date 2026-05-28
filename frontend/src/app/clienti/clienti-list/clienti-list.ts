// ─── LIST ─────────────────────────────────────────────────
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientiService } from '../../services/clienti.service';
import { Cliente } from '../../models/models';

@Component({
  selector: 'app-clienti-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clienti-list.html',
  styleUrls: ['./clienti-list.css']
})
export class ClientiListComponent implements OnInit {
  clienti: Cliente[] = [];
  filtroNome: string = '';
  loading = false;
  errore: string = '';

  constructor(private svc: ClientiService, private router: Router) {}

  ngOnInit(): void { this.carica(); }

  carica(): void {
    this.loading = true;
    this.svc.getAll(this.filtroNome).subscribe({
      next: (data) => { this.clienti = data; this.loading = false; },
      error: () => { this.errore = 'Errore caricamento clienti'; this.loading = false; }
    });
  }

  cerca(): void { this.carica(); }
  resetFiltri(): void { this.filtroNome = ''; this.carica(); }
  apriDettaglio(id: number): void { this.router.navigate(['/clienti', id]); }
  nuovo(): void { this.router.navigate(['/clienti/nuovo']); }

  elimina(id: number, event: Event): void {
    event.stopPropagation();
    if (!confirm('Eliminare questo cliente?')) return;
    this.svc.delete(id).subscribe({
      next: () => this.carica(),
      error: (err) => (this.errore = err.error?.error || 'Errore durante l\'eliminazione')
    });
  }
}
