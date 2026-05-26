import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FattoriniService } from '../../services/fattorini.service';

@Component({
  selector: 'app-fattorino-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fattorino-form.html',
  styleUrls: ['./fattorino-form.css']
})
export class FattorinoFormComponent implements OnInit {
  isModifica = false;
  id: number | null = null;
  errore: string = '';
  successo: string = '';
  loading = false;
  form = { nome: '', mezzo: '', disponibile: 1 };

  constructor(private route: ActivatedRoute, private router: Router, private svc: FattoriniService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isModifica = true;
      this.id = Number(idParam);
      this.svc.getById(this.id).subscribe({
        next: (f) => { this.form = { nome: f.nome, mezzo: f.mezzo, disponibile: f.disponibile }; },
        error: () => (this.errore = 'Fattorino non trovato')
      });
    }
  }

  salva(): void {
    if (!this.form.nome || !this.form.mezzo) { this.errore = 'Nome e mezzo sono obbligatori'; return; }
    this.loading = true;
    const op = this.isModifica ? this.svc.update(this.id!, this.form) : this.svc.create(this.form);
    op.subscribe({
      next: (res) => {
        this.loading = false;
        this.successo = this.isModifica ? 'Fattorino aggiornato!' : 'Fattorino creato!';
        setTimeout(() => this.router.navigate(['/fattorini']), 1000);
      },
      error: (err) => { this.loading = false; this.errore = err.error?.error || 'Errore'; }
    });
  }

  annulla(): void { this.router.navigate(['/fattorini']); }
}
