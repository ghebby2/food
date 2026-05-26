import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdiniService } from '../../services/ordini.service';
import { ClientiService } from '../../services/clienti.service';
import { FattoriniService } from '../../services/fattorini.service';
import { PiattiService } from '../../services/piatti.service';
import { Cliente, Fattorino, Piatto, DettaglioOrdine } from '../../models/models';

@Component({
  selector: 'app-ordine-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ordine-form.html',
  styleUrls: ['./ordine-form.css']
})
export class OrdineFormComponent implements OnInit {
  clienti: Cliente[] = [];
  fattorini: Fattorino[] = [];
  piatti: Piatto[] = [];

  errore: string = '';
  successo: string = '';
  loading = false;

  form = {
    id_cliente: 0,
    id_fattorino: 0,
    stato: 'in attesa'
  };

  dettagli: DettaglioOrdine[] = [];
  piattoSelezionato: number = 0;
  quantitaSelezionata: number = 1;

  constructor(
    private router: Router,
    private svc: OrdiniService,
    private svcC: ClientiService,
    private svcF: FattoriniService,
    private svcP: PiattiService
  ) {}

  ngOnInit(): void {
    this.svcC.getAll().subscribe({ next: (c) => (this.clienti = c) });
    this.svcF.getAll(1).subscribe({ next: (f) => (this.fattorini = f) });
    this.svcP.getAll(undefined, undefined, 1).subscribe({ next: (p) => (this.piatti = p) });
  }

  aggiungiPiatto(): void {
    if (!this.piattoSelezionato) return;
    const piatto = this.piatti.find(p => p.id_piatto === Number(this.piattoSelezionato));
    if (!piatto) return;

    const esistente = this.dettagli.find(d => d.id_piatto === piatto.id_piatto);
    if (esistente) {
      esistente.quantita += this.quantitaSelezionata;
    } else {
      this.dettagli.push({
        id_piatto: piatto.id_piatto,
        piatto_nome: piatto.nome,
        quantita: this.quantitaSelezionata,
        prez_unit: piatto.prezzo
      });
    }
    this.piattoSelezionato = 0;
    this.quantitaSelezionata = 1;
  }

  rimuoviPiatto(index: number): void {
    this.dettagli.splice(index, 1);
  }

  get totale(): number {
    return this.dettagli.reduce((s, d) => s + d.prez_unit * d.quantita, 0);
  }

  salva(): void {
    if (!this.form.id_cliente || !this.form.id_fattorino) {
      this.errore = 'Cliente e fattorino sono obbligatori';
      return;
    }
    if (this.dettagli.length === 0) {
      this.errore = 'Aggiungi almeno un piatto';
      return;
    }
    this.loading = true;
    this.errore = '';

    this.svc.create({ ...this.form, dettagli: this.dettagli }).subscribe({
      next: (res) => {
        this.loading = false;
        this.successo = 'Ordine creato!';
        setTimeout(() => this.router.navigate(['/ordini', res.id_ordine]), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.errore = err.error?.error || 'Errore durante la creazione';
      }
    });
  }

  annulla(): void {
    this.router.navigate(['/ordini']);
  }
}
