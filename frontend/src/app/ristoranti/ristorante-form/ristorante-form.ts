import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RistorantiService } from '../../services/ristoranti.service';
import { Categoria } from '../../models/models';

@Component({
  selector: 'app-ristorante-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ristorante-form.html',
  styleUrls: ['./ristorante-form.css']
})
export class RistoranteFormComponent implements OnInit {
  isModifica = false;
  id: number | null = null;
  categorie: Categoria[] = [];
  errore: string = '';
  successo: string = '';
  loading = false;

  form = {
    id_categoria: 0,
    nome: '',
    indirizzo: '',
    telefono: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: RistorantiService
  ) {}

  ngOnInit(): void {
    this.svc.getCategorie().subscribe({ next: (c) => (this.categorie = c) });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isModifica = true;
      this.id = Number(idParam);
      this.svc.getById(this.id).subscribe({
        next: (r) => {
          this.form = {
            id_categoria: r.id_categoria,
            nome: r.nome,
            indirizzo: r.indirizzo,
            telefono: r.telefono
          };
        },
        error: () => (this.errore = 'Ristorante non trovato')
      });
    }
  }

  salva(): void {
    if (!this.form.nome || !this.form.id_categoria || !this.form.indirizzo || !this.form.telefono) {
      this.errore = 'Tutti i campi sono obbligatori';
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
        this.successo = this.isModifica ? 'Ristorante aggiornato!' : 'Ristorante creato!';
        setTimeout(() => {
          const navId = this.isModifica ? this.id : res.id_ristorante;
          this.router.navigate(['/ristoranti', navId]);
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        this.errore = err.error?.error || 'Errore durante il salvataggio';
      }
    });
  }

  annulla(): void {
    if (this.isModifica) {
      this.router.navigate(['/ristoranti', this.id]);
    } else {
      this.router.navigate(['/ristoranti']);
    }
  }
}
