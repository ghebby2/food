import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientiService } from '../../services/clienti.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.html',
  styleUrls: ['./cliente-form.css']
})
export class ClienteFormComponent implements OnInit {
  isModifica = false;
  id: number | null = null;
  errore: string = '';
  successo: string = '';
  loading = false;

  form = { nome: '', cognome: '', email: '', ind_consegna: '' };

  constructor(private route: ActivatedRoute, private router: Router, private svc: ClientiService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isModifica = true;
      this.id = Number(idParam);
      this.svc.getById(this.id).subscribe({
        next: (c) => { this.form = { nome: c.nome, cognome: c.cognome, email: c.email, ind_consegna: c.ind_consegna }; },
        error: () => (this.errore = 'Cliente non trovato')
      });
    }
  }

  salva(): void {
    if (!this.form.nome || !this.form.cognome || !this.form.email || !this.form.ind_consegna) {
      this.errore = 'Tutti i campi sono obbligatori';
      return;
    }
    this.loading = true;
    const op = this.isModifica ? this.svc.update(this.id!, this.form) : this.svc.create(this.form);
    op.subscribe({
      next: (res) => {
        this.loading = false;
        this.successo = this.isModifica ? 'Cliente aggiornato!' : 'Cliente creato!';
        setTimeout(() => {
          const navId = this.isModifica ? this.id : res.id_cliente;
          this.router.navigate(['/clienti', navId]);
        }, 1000);
      },
      error: (err) => { this.loading = false; this.errore = err.error?.error || 'Errore'; }
    });
  }

  annulla(): void {
    this.isModifica ? this.router.navigate(['/clienti', this.id]) : this.router.navigate(['/clienti']);
  }
}
