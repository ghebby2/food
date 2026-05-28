// ─── CATEGORIA ───────────────────────────────────────────
export interface Categoria {
  id_categoria: number;
  nome: string;
  descrizione?: string;
}

// ─── RISTORANTE ───────────────────────────────────────────
export interface Ristorante {
  id_ristorante: number;
  id_categoria: number;
  nome: string;
  indirizzo: string;
  telefono: string;
  categoria_nome?: string;
}

export interface RistoranteForm {
  id_categoria: number;
  nome: string;
  indirizzo: string;
  telefono: string;
}

// ─── PIATTO ───────────────────────────────────────────────
export interface Piatto {
  id_piatto: number;
  id_ristorante: number;
  nome: string;
  prezzo: number;
  disponibile: number;
  ristorante_nome?: string;
  ingredienti?: Ingrediente[];
}

export interface PiattoForm {
  id_ristorante: number;
  nome: string;
  prezzo: number;
  disponibile: number;
}

// ─── INGREDIENTE ──────────────────────────────────────────
export interface Ingrediente {
  id_ingrediente: number;
  nome: string;
  allergenico: number;
}

export interface IngredienteForm {
  nome: string;
  allergenico: number;
}

// ─── CLIENTE ──────────────────────────────────────────────
export interface Cliente {
  id_cliente: number;
  nome: string;
  cognome: string;
  email: string;
  ind_consegna: string;
}

export interface ClienteForm {
  nome: string;
  cognome: string;
  email: string;
  ind_consegna: string;
}

// ─── FATTORINO ────────────────────────────────────────────
export interface Fattorino {
  id_fattorino: number;
  nome: string;
  mezzo: string;
  disponibile: number;
}

export interface FattorinoForm {
  nome: string;
  mezzo: string;
  disponibile: number;
}

// ─── ORDINE ───────────────────────────────────────────────
export interface DettaglioOrdine {
  id_piatto: number;
  piatto_nome?: string;
  quantita: number;
  prez_unit: number;
}

export interface Ordine {
  id_ordine: number;
  id_cliente: number;
  id_fattorino: number;
  stato: string;
  totale: number;
  data_ora?: string;
  cliente_nome?: string;
  cliente_cognome?: string;
  fattorino_nome?: string;
  dettagli?: DettaglioOrdine[];
}

export interface OrdineForm {
  id_cliente: number;
  id_fattorino: number;
  stato?: string;
  dettagli: DettaglioOrdine[];
}

// ─── RECENSIONE ───────────────────────────────────────────
export interface Recensione {
  id_recensione: number;
  id_cliente: number;
  id_ristorante: number;
  voto: number;
  commento?: string;
  cliente_nome?: string;
  cliente_cognome?: string;
  ristorante_nome?: string;
}

export interface RecensioneForm {
  id_cliente: number;
  id_ristorante: number;
  voto: number;
  commento?: string;
}