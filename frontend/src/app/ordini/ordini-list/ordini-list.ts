import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdiniService } from '../../services/ordini.service';
import { ClientiService } from '../../services/clienti.service';
import { Ordine, Cliente } from '../../models/models';

@Component({
  selector: 'app-ordini-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ordini-list.html',
  styleUrls: ['./ordini-list.css']
})
export class OrdiniListComponent implements OnInit {
  ordini: Ordine[] = [];
  clienti: Cliente[] = [];
  filtroCliente: number | undefined;
  filtroStato: string = '';
  loading = false;
  errore: string = '';

  stati = ['in attesa', 'confermato', 'in consegna', 'consegnato', 'annullato'];

  constructor(private svc: OrdiniService, private svcC: ClientiService, private router: Router) {}

  ngOnInit(): void {
    this.svcC.getAll().subscribe({ next: (c) => (this.clienti = c) });
    this.carica();
  }

  carica(): void {
    this.loading = true;
    this.svc.getAll(this.filtroCliente, this.filtroStato || undefined).subscribe({
      next: (data) => { this.ordini = data; this.loading = false; },
      error: () => { this.errore = 'Errore caricamento ordini'; this.loading = false; }
    });
  }

  resetFiltri(): void { this.filtroCliente = undefined; this.filtroStato = ''; this.carica(); }
  apriDettaglio(id: number): void { this.router.navigate(['/ordini', id]); }
  nuovo(): void { this.router.navigate(['/ordini/nuovo']); }

  elimina(id: number, e: Event): void {
    e.stopPropagation();
    if (!confirm('Eliminare questo ordine?')) return;
    this.svc.delete(id).subscribe({ next: () => this.carica() });
  }

  badgeClass(stato: string): string {
    const map: any = {
      'in attesa': 'badge-yellow', 'confermato': 'badge-blue',
      'in consegna': 'badge-orange', 'consegnato': 'badge-green', 'annullato': 'badge-red'
    };
    return map[stato] || 'badge';
  }
}
