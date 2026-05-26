import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PiattiService } from '../../services/piatti.service';
import { RistorantiService } from '../../services/ristoranti.service';
import { Ristorante } from '../../models/models';

@Component({
  selector: 'app-piatto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './piatto-form.html',
  styleUrls: ['./piatto-form.css']
})
export class PiattoFormComponent implements OnInit {
  isModifica = false;
  id: number | null = null;
  ristoranti: Ristorante[] = [];
  errore: string = '';
  successo: string = '';
  loading = false;

  form = {
    id_ristorante: 0,
    nome: '',
    prezzo: 0,
    disponibile: 1
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: PiattiService,
    private svcR: RistorantiService
  ) {}

  ngOnInit(): void {
    this.svcR.getAll().subscribe({ next: (r) => (this.ristoranti = r) });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isModifica = true;
      this.id = Number(idParam);
      this.svc.getById(this.id).subscribe({
        next: (p) => {
          this.form = {
            id_ristorante: p.id_ristorante,
            nome: p.nome,
            prezzo: p.prezzo,
            disponibile: p.disponibile
          };
        },
        error: () => (this.errore = 'Piatto non trovato')
      });
    }
  }

  salva(): void {
    if (!this.form.nome || !this.form.id_ristorante || this.form.prezzo <= 0) {
      this.errore = 'Nome, ristorante e prezzo sono obbligatori';
      return;
    }
    this.loading = true;
    this.errore = '';

    const op = this.isModifica
      ? this.svc.update(this.id!, this.form)
      : this.svc.create(this.form);

    op.subscribe({
      next: (res) => {
        this.loading = false;
        this.successo = this.isModifica ? 'Piatto aggiornato!' : 'Piatto creato!';
        setTimeout(() => {
          const navId = this.isModifica ? this.id : res.id_piatto;
          this.router.navigate(['/piatti', navId]);
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        this.errore = err.error?.error || 'Errore durante il salvataggio';
      }
    });
  }

  annulla(): void {
    this.isModifica ? this.router.navigate(['/piatti', this.id]) : this.router.navigate(['/piatti']);
  }
}
