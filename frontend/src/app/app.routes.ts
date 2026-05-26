import { Routes } from '@angular/router';

// Ristoranti
import { RistorantiListComponent } from './ristoranti/ristoranti-list/ristoranti-list';
import { RistoranteDetailComponent } from './ristoranti/ristorante-detail/ristorante-detail';
import { RistoranteFormComponent } from './ristoranti/ristorante-form/ristorante-form';

// Piatti
import { PiattiListComponent } from './piatti/piatti-list/piatti-list';
import { PiattoDetailComponent } from './piatti/piatto-detail/piatto-detail';
import { PiattoFormComponent } from './piatti/piatto-form/piatto-form';

// Ingredienti
import { IngredientiListComponent } from './ingredienti/ingredienti-list/ingredienti-list';
import { IngredienteFormComponent } from './ingredienti/ingrediente-form/ingrediente-form';

// Clienti
import { ClientiListComponent } from './clienti/clienti-list/clienti-list';
import { ClienteDetailComponent } from './clienti/cliente-detail/cliente-detail';
import { ClienteFormComponent } from './clienti/cliente-form/cliente-form';

// Fattorini
import { FattoriniListComponent } from './fattorini/fattorini-list/fattorini-list';
import { FattorinoFormComponent } from './fattorini/fattorino-form/fattorino-form';
// Ordini
import { OrdiniListComponent } from './ordini/ordini-list/ordini-list';
import { OrdineDetailComponent } from './ordini/ordine-detail/ordine-detail';
import { OrdineFormComponent } from './ordini/ordine-form/ordine-form';

// Recensioni
import { RecensioniListComponent } from './recensioni/recensioni-list/recensioni-list';
import { RecensioneFormComponent } from './recensioni/recensione-form/recensione-form';

export const routes: Routes = [
  { path: '', redirectTo: '/ristoranti', pathMatch: 'full' },

  // Ristoranti
  { path: 'ristoranti', component: RistorantiListComponent },
  { path: 'ristoranti/nuovo', component: RistoranteFormComponent },
  { path: 'ristoranti/:id', component: RistoranteDetailComponent },
  { path: 'ristoranti/:id/modifica', component: RistoranteFormComponent },

  // Piatti
  { path: 'piatti', component: PiattiListComponent },
  { path: 'piatti/nuovo', component: PiattoFormComponent },
  { path: 'piatti/:id', component: PiattoDetailComponent },
  { path: 'piatti/:id/modifica', component: PiattoFormComponent },

  // Ingredienti
  { path: 'ingredienti', component: IngredientiListComponent },
  { path: 'ingredienti/nuovo', component: IngredienteFormComponent },
  { path: 'ingredienti/:id/modifica', component: IngredienteFormComponent },

  // Clienti
  { path: 'clienti', component: ClientiListComponent },
  { path: 'clienti/nuovo', component: ClienteFormComponent },
  { path: 'clienti/:id', component: ClienteDetailComponent },
  { path: 'clienti/:id/modifica', component: ClienteFormComponent },

  // Fattorini
  { path: 'fattorini', component: FattoriniListComponent },
  { path: 'fattorini/nuovo', component: FattorinoFormComponent },
  { path: 'fattorini/:id/modifica', component: FattorinoFormComponent },

  // Ordini
  { path: 'ordini', component: OrdiniListComponent },
  { path: 'ordini/nuovo', component: OrdineFormComponent },
  { path: 'ordini/:id', component: OrdineDetailComponent },

  // Recensioni
  { path: 'recensioni', component: RecensioniListComponent },
  { path: 'recensioni/nuova', component: RecensioneFormComponent },
  { path: 'recensioni/:id/modifica', component: RecensioneFormComponent },

  // Fallback
  { path: '**', redirectTo: '/ristoranti' }
];