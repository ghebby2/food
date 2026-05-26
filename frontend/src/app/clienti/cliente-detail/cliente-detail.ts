import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientiService } from '../../services/clienti.service';
import { OrdiniService } from '../../services/ordini.service';
import { Cliente, Ordine } from '../../models/models';

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-detail.html',
  styleUrls: ['./cliente-detail.css']
})
export class ClienteDetailComponent implements OnInit {
  cliente: Cliente | null = null;
  ordini: Ordine[] = [];
  loading = true;
  errore: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: ClientiService,
    private svcOrdini: OrdiniService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe({
      next: (c) => { this.cliente = c; this.loading = false; },
      error: () => { this.errore = 'Cliente non trovato'; this.loading = false; }
    });
    this.svcOrdini.getAll(id).subscribe({ next: (o) => (this.ordini = o) });
  }

  modifica(): void { this.router.navigate(['/clienti', this.cliente!.id_cliente, 'modifica']); }
  indietro(): void { this.router.navigate(['/clienti']); }
  apriOrdine(id: number): void { this.router.navigate(['/ordini', id]); }

  badgeClass(stato: string): string {
    const map: any = {
      'in attesa': 'badge-yellow', 'confermato': 'badge-blue',
      'in consegna': 'badge-orange', 'consegnato': 'badge-green', 'annullato': 'badge-red'
    };
    return map[stato] || 'badge';
  }
}
