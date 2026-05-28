import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RistorantiService } from '../../services/ristoranti.service';
import { Ristorante, Categoria } from '../../models/models';

@Component({
  selector: 'app-ristoranti-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ristoranti-list.html',
  styleUrls: ['./ristoranti-list.css']
})
export class RistorantiListComponent implements OnInit {
  ristoranti: Ristorante[] = [];
  categorie: Categoria[] = [];
  filtroNome: string = '';
  filtroCategoria: number | undefined;
  loading = false;
  errore: string = '';

  constructor(private svc: RistorantiService, private router: Router) {}

  ngOnInit(): void {
    this.caricaCategorie();
    this.caricaRistoranti();
  }

  caricaCategorie(): void {
    this.svc.getCategorie().subscribe({
      next: (data) => (this.categorie = data),
      error: () => (this.errore = 'Errore nel caricamento categorie')
    });
  }

  caricaRistoranti(): void {
    this.loading = true;
    this.svc.getAll(this.filtroNome, this.filtroCategoria).subscribe({
      next: (data) => {
        this.ristoranti = data;
        this.loading = false;
      },
      error: () => {
        this.errore = 'Errore nel caricamento ristoranti';
        this.loading = false;
      }
    });
  }

  cerca(): void {
    this.caricaRistoranti();
  }

  resetFiltri(): void {
    this.filtroNome = '';
    this.filtroCategoria = undefined;
    this.caricaRistoranti();
  }

  apriDettaglio(id: number): void {
    this.router.navigate(['/ristoranti', id]);
  }

  elimina(id: number, event: Event): void {
    event.stopPropagation();
    if (!confirm('Eliminare questo ristorante?')) return;
    this.svc.delete(id).subscribe({
      next: () => this.caricaRistoranti(),
      error: (err) => (this.errore = err.error?.error || 'Errore durante l\'eliminazione')
    });
  }

  nuovo(): void {
    this.router.navigate(['/ristoranti/nuovo']);
  }
}
