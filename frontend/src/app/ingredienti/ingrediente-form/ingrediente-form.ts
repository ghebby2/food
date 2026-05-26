import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PiattiService } from '../../services/piatti.service';

@Component({
  selector: 'app-ingrediente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ingrediente-form.html',
  styleUrls: ['./ingrediente-form.css']
})
export class IngredienteFormComponent implements OnInit {
  isModifica = false;
  id: number | null = null;
  errore: string = '';
  successo: string = '';
  loading = false;

  form = { nome: '', allergenico: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: PiattiService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isModifica = true;
      this.id = Number(idParam);
      this.svc.getIngrediente(this.id).subscribe({
        next: (i) => { this.form = { nome: i.nome, allergenico: i.allergenico }; },
        error: () => (this.errore = 'Ingrediente non trovato')
      });
    }
  }

  salva(): void {
    if (!this.form.nome) { this.errore = 'Il nome è obbligatorio'; return; }
    this.loading = true;
    this.errore = '';

    const op = this.isModifica
      ? this.svc.updateIngrediente(this.id!, this.form)
      : this.svc.createIngrediente(this.form);

    op.subscribe({
      next: () => {
        this.loading = false;
        this.successo = this.isModifica ? 'Ingrediente aggiornato!' : 'Ingrediente creato!';
        setTimeout(() => this.router.navigate(['/ingredienti']), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.errore = err.error?.error || 'Errore durante il salvataggio';
      }
    });
  }

  annulla(): void { this.router.navigate(['/ingredienti']); }
}
