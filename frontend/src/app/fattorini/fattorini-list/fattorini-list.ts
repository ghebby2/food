import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FattoriniService } from '../../services/fattorini.service';
import { Fattorino } from '../../models/models';

@Component({
  selector: 'app-fattorini-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fattorini-list.html',
  styleUrls: ['./fattorini-list.css']
})
export class FattoriniListComponent implements OnInit {
  fattorini: Fattorino[] = [];
  filtroDisponibile: string = '';
  loading = false;
  errore: string = '';

  constructor(private svc: FattoriniService, private router: Router) {}

  ngOnInit(): void { this.carica(); }

  carica(): void {
    this.loading = true;
    const disp = this.filtroDisponibile !== '' ? Number(this.filtroDisponibile) : undefined;
    this.svc.getAll(disp).subscribe({
      next: (data) => { this.fattorini = data; this.loading = false; },
      error: () => { this.errore = 'Errore caricamento'; this.loading = false; }
    });
  }

  nuovo(): void { this.router.navigate(['/fattorini/nuovo']); }
  modifica(id: number, e: Event): void { e.stopPropagation(); this.router.navigate(['/fattorini', id, 'modifica']); }

  elimina(id: number, e: Event): void {
    e.stopPropagation();
    if (!confirm('Eliminare questo fattorino?')) return;
    this.svc.delete(id).subscribe({ next: () => this.carica() });
  }
}
