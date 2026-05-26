import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RistorantiService } from '../../services/ristoranti.service';
import { PiattiService } from '../../services/piatti.service';
import { RecensioniService } from '../../services/recensioni.service';
import { Ristorante, Piatto, Recensione } from '../../models/models';

@Component({
  selector: 'app-ristorante-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ristorante-detail.html',
  styleUrls: ['./ristorante-detail.css']
})
export class RistoranteDetailComponent implements OnInit {
  ristorante: Ristorante | null = null;
  piatti: Piatto[] = [];
  recensioni: Recensione[] = [];
  loading = true;
  errore: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svcRistoranti: RistorantiService,
    private svcPiatti: PiattiService,
    private svcRecensioni: RecensioniService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.caricaDati(id);
  }

  caricaDati(id: number): void {
    this.svcRistoranti.getById(id).subscribe({
      next: (r) => {
        this.ristorante = r;
        this.loading = false;
      },
      error: () => {
        this.errore = 'Ristorante non trovato';
        this.loading = false;
      }
    });

    this.svcPiatti.getAll(undefined, id).subscribe({
      next: (p) => (this.piatti = p),
      error: () => {}
    });

    this.svcRecensioni.getAll(id).subscribe({
      next: (r) => (this.recensioni = r),
      error: () => {}
    });
  }

  modifica(): void {
    this.router.navigate(['/ristoranti', this.ristorante!.id_ristorante, 'modifica']);
  }

  indietro(): void {
    this.router.navigate(['/ristoranti']);
  }

  mediaVoti(): string {
    if (!this.recensioni.length) return 'N/D';
    const media = this.recensioni.reduce((s, r) => s + r.voto, 0) / this.recensioni.length;
    return media.toFixed(1);
  }

  stelle(voto: number): string {
    return '★'.repeat(voto) + '☆'.repeat(5 - voto);
  }
}
