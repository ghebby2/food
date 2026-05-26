import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecensioniService } from '../../services/recensioni.service';
import { RistorantiService } from '../../services/ristoranti.service';
import { ClientiService } from '../../services/clienti.service';
import { Ristorante, Cliente } from '../../models/models';

@Component({
  selector: 'app-recensione-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recensione-form.html',
  styleUrls: ['./recensione-form.css']
})
export class RecensioneFormComponent implements OnInit {
  isModifica = false;
  id: number | null = null;
  ristoranti: Ristorante[] = [];
  clienti: Cliente[] = [];
  errore: string = '';
  successo: string = '';
  loading = false;

  form = {
    id_cliente: 0,
    id_ristorante: 0,
    voto: 5,
    commento: ''
  };

  voti = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: RecensioniService,
    private svcR: RistorantiService,
    private svcC: ClientiService
  ) {}

  ngOnInit(): void {
    this.svcR.getAll().subscribe({ next: (r) => (this.ristoranti = r) });
    this.svcC.getAll().subscribe({ next: (c) => (this.clienti = c) });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isModifica = true;
      this.id = Number(idParam);
      this.svc.getById(this.id).subscribe({
        next: (r) => {
          this.form = {
            id_cliente: r.id_cliente,
            id_ristorante: r.id_ristorante,
            voto: r.voto,
            commento: r.commento || ''
          };
        },
        error: () => (this.errore = 'Recensione non trovata')
      });
    }
  }

  stelle(n: number): string {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  salva(): void {
    if (!this.form.id_cliente || !this.form.id_ristorante || !this.form.voto) {
      this.errore = 'Cliente, ristorante e voto sono obbligatori';
      return;
    }
    this.loading = true;
    this.errore = '';

    const op = this.isModifica
      ? this.svc.update(this.id!, { voto: this.form.voto, commento: this.form.commento })
      : this.svc.create(this.form);

    op.subscribe({
      next: () => {
        this.loading = false;
        this.successo = this.isModifica ? 'Recensione aggiornata!' : 'Recensione creata!';
        setTimeout(() => this.router.navigate(['/recensioni']), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.errore = err.error?.error || 'Errore durante il salvataggio';
      }
    });
  }

  annulla(): void {
    this.router.navigate(['/recensioni']);
  }
}
