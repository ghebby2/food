import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdiniService } from '../../services/ordini.service';
import { Ordine } from '../../models/models';

@Component({
  selector: 'app-ordine-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ordine-detail.html',
  styleUrls: ['./ordine-detail.css']
})
export class OrdineDetailComponent implements OnInit {
  ordine: Ordine | null = null;
  loading = true;
  errore: string = '';
  successo: string = '';

  stati = ['in attesa', 'confermato', 'in consegna', 'consegnato', 'annullato'];
  nuovoStato: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: OrdiniService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carica(id);
  }

  carica(id: number): void {
    this.svc.getById(id).subscribe({
      next: (o) => {
        this.ordine = o;
        this.nuovoStato = o.stato;
        this.loading = false;
      },
      error: () => {
        this.errore = 'Ordine non trovato';
        this.loading = false;
      }
    });
  }

  aggiornaStato(): void {
    if (!this.ordine || this.nuovoStato === this.ordine.stato) return;
    this.svc.update(this.ordine.id_ordine, { stato: this.nuovoStato }).subscribe({
      next: () => {
        this.successo = 'Stato aggiornato!';
        this.ordine!.stato = this.nuovoStato;
        setTimeout(() => (this.successo = ''), 2000);
      },
      error: (err) => (this.errore = err.error?.error || 'Errore aggiornamento stato')
    });
  }

  elimina(): void {
    if (!confirm('Eliminare questo ordine?')) return;
    this.svc.delete(this.ordine!.id_ordine).subscribe({
      next: () => this.router.navigate(['/ordini']),
      error: (err) => (this.errore = err.error?.error || 'Errore durante l\'eliminazione')
    });
  }

  indietro(): void {
    this.router.navigate(['/ordini']);
  }

  badgeClass(stato: string): string {
    const map: any = {
      'in attesa': 'badge-yellow',
      'confermato': 'badge-blue',
      'in consegna': 'badge-orange',
      'consegnato': 'badge-green',
      'annullato': 'badge-red'
    };
    return map[stato] || 'badge';
  }

  get totaleCalcolato(): number {
    if (!this.ordine?.dettagli) return this.ordine?.totale || 0;
    return this.ordine.dettagli.reduce((s, d) => s + d.prez_unit * d.quantita, 0);
  }
}
