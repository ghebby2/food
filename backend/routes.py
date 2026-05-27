from flask import Blueprint, jsonify, request
from database import get_db, query_db, mutate_db

api = Blueprint('api', __name__)

# ─────────────────────────────────────────────
#  CATEGORIA RISTORANTE
# ─────────────────────────────────────────────

@api.route('/categorie', methods=['GET'])
def get_categorie():
    rows = query_db("SELECT * FROM categoria_ristorante ORDER BY nome")
    return jsonify([dict(r) for r in rows])

@api.route('/categorie/<int:id>', methods=['GET'])
def get_categoria(id):
    row = query_db("SELECT * FROM categoria_ristorante WHERE id_categoria = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Categoria non trovata"}), 404
    return jsonify(dict(row))

@api.route('/categorie', methods=['POST'])
def create_categoria():
    data = request.get_json()
    if not data or not data.get('nome'):
        return jsonify({"error": "Campo 'nome' obbligatorio"}), 400
    new_id = mutate_db(
        "INSERT INTO categoria_ristorante (nome, descrizione) VALUES (%s, %s)",
        [data['nome'], data.get('descrizione', '')]
    )
    return jsonify({"message": "Categoria creata", "id_categoria": new_id}), 201

@api.route('/categorie/<int:id>', methods=['PUT'])
def update_categoria(id):
    row = query_db("SELECT * FROM categoria_ristorante WHERE id_categoria = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Categoria non trovata"}), 404
    data = request.get_json()
    if not data or not data.get('nome'):
        return jsonify({"error": "Campo 'nome' obbligatorio"}), 400
    mutate_db(
        "UPDATE categoria_ristorante SET nome=%s, descrizione=%s WHERE id_categoria=%s",
        [data['nome'], data.get('descrizione', row['descrizione']), id]
    )
    return jsonify({"message": "Categoria aggiornata"})

@api.route('/categorie/<int:id>', methods=['DELETE'])
def delete_categoria(id):
    row = query_db("SELECT * FROM categoria_ristorante WHERE id_categoria = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Categoria non trovata"}), 404
    n = query_db("SELECT COUNT(*) as n FROM ristorante WHERE id_categoria = %s", [id], one=True)
    if n['n'] > 0:
        return jsonify({"error": f"Impossibile eliminare: la categoria ha {n['n']} ristoranti collegati"}), 409
    mutate_db("DELETE FROM categoria_ristorante WHERE id_categoria = %s", [id])
    return jsonify({"message": "Categoria eliminata"})

# ─────────────────────────────────────────────
#  RISTORANTE
# ─────────────────────────────────────────────

@api.route('/ristoranti', methods=['GET'])
def get_ristoranti():
    nome = request.args.get('nome', '')
    categoria = request.args.get('id_categoria', '')
    query = """
        SELECT r.*, c.nome AS categoria_nome
        FROM ristorante r
        JOIN categoria_ristorante c ON r.id_categoria = c.id_categoria
        WHERE 1=1
    """
    args = []
    if nome:
        query += " AND r.nome LIKE %s"
        args.append(f'%{nome}%')
    if categoria:
        query += " AND r.id_categoria = %s"
        args.append(categoria)
    query += " ORDER BY r.nome"
    rows = query_db(query, args)
    return jsonify([dict(r) for r in rows])

@api.route('/ristoranti/<int:id>', methods=['GET'])
def get_ristorante(id):
    row = query_db("""
        SELECT r.*, c.nome AS categoria_nome
        FROM ristorante r
        JOIN categoria_ristorante c ON r.id_categoria = c.id_categoria
        WHERE r.id_ristorante = %s
    """, [id], one=True)
    if not row:
        return jsonify({"error": "Ristorante non trovato"}), 404
    return jsonify(dict(row))

@api.route('/ristoranti', methods=['POST'])
def create_ristorante():
    data = request.get_json()
    required = ['id_categoria', 'nome', 'indirizzo', 'telefono']
    for field in required:
        if not data or not data.get(field):
            return jsonify({"error": f"Campo '{field}' obbligatorio"}), 400
    new_id = mutate_db(
        "INSERT INTO ristorante (id_categoria, nome, indirizzo, telefono) VALUES (%s, %s, %s, %s)",
        [data['id_categoria'], data['nome'], data['indirizzo'], data['telefono']]
    )
    return jsonify({"message": "Ristorante creato", "id_ristorante": new_id}), 201

@api.route('/ristoranti/<int:id>', methods=['PUT'])
def update_ristorante(id):
    row = query_db("SELECT * FROM ristorante WHERE id_ristorante = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Ristorante non trovato"}), 404
    data = request.get_json()
    mutate_db("""
        UPDATE ristorante SET id_categoria=%s, nome=%s, indirizzo=%s, telefono=%s
        WHERE id_ristorante=%s
    """, [
        data.get('id_categoria', row['id_categoria']),
        data.get('nome', row['nome']),
        data.get('indirizzo', row['indirizzo']),
        data.get('telefono', row['telefono']),
        id
    ])
    return jsonify({"message": "Ristorante aggiornato"})

@api.route('/ristoranti/<int:id>', methods=['DELETE'])
def delete_ristorante(id):
    row = query_db("SELECT * FROM ristorante WHERE id_ristorante = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Ristorante non trovato"}), 404
    piatti = query_db("SELECT COUNT(*) as n FROM piatto WHERE id_ristorante = %s", [id], one=True)
    if piatti['n'] > 0:
        return jsonify({"error": f"Impossibile eliminare: il ristorante ha {piatti['n']} piatti collegati"}), 409
    recensioni = query_db("SELECT COUNT(*) as n FROM recensioni WHERE id_ristorante = %s", [id], one=True)
    if recensioni['n'] > 0:
        return jsonify({"error": f"Impossibile eliminare: il ristorante ha {recensioni['n']} recensioni collegate"}), 409
    mutate_db("DELETE FROM ristorante WHERE id_ristorante = %s", [id])
    return jsonify({"message": "Ristorante eliminato"})
# ─────────────────────────────────────────────
#  PIATTO
# ─────────────────────────────────────────────

@api.route('/piatti', methods=['GET'])
def get_piatti():
    nome = request.args.get('nome', '')
    id_ristorante = request.args.get('id_ristorante', '')
    disponibile = request.args.get('disponibile', '')
    query = """
        SELECT p.*, r.nome AS ristorante_nome
        FROM piatto p
        JOIN ristorante r ON p.id_ristorante = r.id_ristorante
        WHERE 1=1
    """
    args = []
    if nome:
        query += " AND p.nome LIKE %s"
        args.append(f'%{nome}%')
    if id_ristorante:
        query += " AND p.id_ristorante = %s"
        args.append(id_ristorante)
    if disponibile != '':
        query += " AND p.disponibile = %s"
        args.append(disponibile)
    query += " ORDER BY p.nome"
    rows = query_db(query, args)
    return jsonify([dict(r) for r in rows])

@api.route('/piatti/<int:id>', methods=['GET'])
def get_piatto(id):
    row = query_db("""
        SELECT p.*, r.nome AS ristorante_nome
        FROM piatto p
        JOIN ristorante r ON p.id_ristorante = r.id_ristorante
        WHERE p.id_piatto = %s
    """, [id], one=True)
    if not row:
        return jsonify({"error": "Piatto non trovato"}), 404
    ingredienti = query_db("""
        SELECT i.* FROM ingrediente i
        JOIN composizione_piatto cp ON i.id_ingrediente = cp.id_ingrediente
        WHERE cp.id_piatto = %s
    """, [id])
    result = dict(row)
    result['ingredienti'] = [dict(i) for i in ingredienti]
    return jsonify(result)

@api.route('/piatti', methods=['POST'])
def create_piatto():
    data = request.get_json()
    required = ['id_ristorante', 'nome', 'prezzo']
    for field in required:
        if not data or data.get(field) is None:
            return jsonify({"error": f"Campo '{field}' obbligatorio"}), 400
    new_id = mutate_db(
        "INSERT INTO piatto (id_ristorante, nome, prezzo, disponibile) VALUES (%s, %s, %s, %s)",
        [data['id_ristorante'], data['nome'], data['prezzo'], data.get('disponibile', 1)]
    )
    return jsonify({"message": "Piatto creato", "id_piatto": new_id}), 201

@api.route('/piatti/<int:id>', methods=['PUT'])
def update_piatto(id):
    row = query_db("SELECT * FROM piatto WHERE id_piatto = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Piatto non trovato"}), 404
    data = request.get_json()
    mutate_db("""
        UPDATE piatto SET id_ristorante=%s, nome=%s, prezzo=%s, disponibile=%s
        WHERE id_piatto=%s
    """, [
        data.get('id_ristorante', row['id_ristorante']),
        data.get('nome', row['nome']),
        data.get('prezzo', row['prezzo']),
        data.get('disponibile', row['disponibile']),
        id
    ])
    return jsonify({"message": "Piatto aggiornato"})

@api.route('/piatti/<int:id>', methods=['DELETE'])
def delete_piatto(id):
    row = query_db("SELECT * FROM piatto WHERE id_piatto = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Piatto non trovato"}), 404
    n = query_db("SELECT COUNT(*) as n FROM dettaglio_ordine WHERE id_piatto = %s", [id], one=True)
    if n['n'] > 0:
        return jsonify({"error": f"Impossibile eliminare: il piatto è presente in {n['n']} ordini"}), 409
    mutate_db("DELETE FROM composizione_piatto WHERE id_piatto = %s", [id])
    mutate_db("DELETE FROM piatto WHERE id_piatto = %s", [id])
    return jsonify({"message": "Piatto eliminato"})
# ─────────────────────────────────────────────
#  INGREDIENTE
# ─────────────────────────────────────────────

@api.route('/ingredienti', methods=['GET'])
def get_ingredienti():
    allergenico = request.args.get('allergenico', '')
    query = "SELECT * FROM ingrediente WHERE 1=1"
    args = []
    if allergenico != '':
        query += " AND allergenico = %s"
        args.append(allergenico)
    rows = query_db(query + " ORDER BY nome", args)
    return jsonify([dict(r) for r in rows])

@api.route('/ingredienti/<int:id>', methods=['GET'])
def get_ingrediente(id):
    row = query_db("SELECT * FROM ingrediente WHERE id_ingrediente = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Ingrediente non trovato"}), 404
    return jsonify(dict(row))

@api.route('/ingredienti', methods=['POST'])
def create_ingrediente():
    data = request.get_json()
    if not data or not data.get('nome'):
        return jsonify({"error": "Campo 'nome' obbligatorio"}), 400
    new_id = mutate_db(
        "INSERT INTO ingrediente (nome, allergenico) VALUES (%s, %s)",
        [data['nome'], data.get('allergenico', 0)]
    )
    return jsonify({"message": "Ingrediente creato", "id_ingrediente": new_id}), 201

@api.route('/ingredienti/<int:id>', methods=['PUT'])
def update_ingrediente(id):
    row = query_db("SELECT * FROM ingrediente WHERE id_ingrediente = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Ingrediente non trovato"}), 404
    data = request.get_json()
    mutate_db(
        "UPDATE ingrediente SET nome=%s, allergenico=%s WHERE id_ingrediente=%s",
        [data.get('nome', row['nome']), data.get('allergenico', row['allergenico']), id]
    )
    return jsonify({"message": "Ingrediente aggiornato"})

@api.route('/ingredienti/<int:id>', methods=['DELETE'])
def delete_ingrediente(id):
    row = query_db("SELECT * FROM ingrediente WHERE id_ingrediente = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Ingrediente non trovato"}), 404
    n = query_db("SELECT COUNT(*) as n FROM composizione_piatto WHERE id_ingrediente = %s", [id], one=True)
    if n['n'] > 0:
        return jsonify({"error": f"Impossibile eliminare: l'ingrediente è usato in {n['n']} piatti"}), 409
    mutate_db("DELETE FROM ingrediente WHERE id_ingrediente = %s", [id])
    return jsonify({"message": "Ingrediente eliminato"})

# ─────────────────────────────────────────────
#  COMPOSIZIONE PIATTO
# ─────────────────────────────────────────────

@api.route('/piatti/<int:id_piatto>/ingredienti', methods=['POST'])
def add_ingrediente_to_piatto(id_piatto):
    data = request.get_json()
    if not data or not data.get('id_ingrediente'):
        return jsonify({"error": "Campo 'id_ingrediente' obbligatorio"}), 400
    existing = query_db(
        "SELECT * FROM composizione_piatto WHERE id_piatto=%s AND id_ingrediente=%s",
        [id_piatto, data['id_ingrediente']], one=True
    )
    if existing:
        return jsonify({"error": "Ingrediente già presente"}), 409
    mutate_db(
        "INSERT INTO composizione_piatto (id_piatto, id_ingrediente) VALUES (%s, %s)",
        [id_piatto, data['id_ingrediente']]
    )
    return jsonify({"message": "Ingrediente aggiunto al piatto"}), 201

@api.route('/piatti/<int:id_piatto>/ingredienti/<int:id_ingrediente>', methods=['DELETE'])
def remove_ingrediente_from_piatto(id_piatto, id_ingrediente):
    row = query_db(
        "SELECT * FROM composizione_piatto WHERE id_piatto=%s AND id_ingrediente=%s",
        [id_piatto, id_ingrediente], one=True
    )
    if not row:
        return jsonify({"error": "Associazione non trovata"}), 404
    mutate_db(
        "DELETE FROM composizione_piatto WHERE id_piatto=%s AND id_ingrediente=%s",
        [id_piatto, id_ingrediente]
    )
    return jsonify({"message": "Ingrediente rimosso dal piatto"})

# ─────────────────────────────────────────────
#  CLIENTE
# ─────────────────────────────────────────────

@api.route('/clienti', methods=['GET'])
def get_clienti():
    nome = request.args.get('nome', '')
    query = "SELECT * FROM clienti WHERE 1=1"
    args = []
    if nome:
        query += " AND (nome LIKE %s OR cognome LIKE %s)"
        args.extend([f'%{nome}%', f'%{nome}%'])
    rows = query_db(query + " ORDER BY cognome, nome", args)
    return jsonify([dict(r) for r in rows])

@api.route('/clienti/<int:id>', methods=['GET'])
def get_cliente(id):
    row = query_db("SELECT * FROM clienti WHERE id_cliente = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Cliente non trovato"}), 404
    return jsonify(dict(row))

@api.route('/clienti', methods=['POST'])
def create_cliente():
    data = request.get_json()
    required = ['nome', 'cognome', 'email', 'ind_consegna']
    for field in required:
        if not data or not data.get(field):
            return jsonify({"error": f"Campo '{field}' obbligatorio"}), 400
    new_id = mutate_db(
        "INSERT INTO clienti (nome, cognome, email, ind_consegna) VALUES (%s, %s, %s, %s)",
        [data['nome'], data['cognome'], data['email'], data['ind_consegna']]
    )
    return jsonify({"message": "Cliente creato", "id_cliente": new_id}), 201

@api.route('/clienti/<int:id>', methods=['PUT'])
def update_cliente(id):
    row = query_db("SELECT * FROM clienti WHERE id_cliente = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Cliente non trovato"}), 404
    data = request.get_json()
    mutate_db("""
        UPDATE clienti SET nome=%s, cognome=%s, email=%s, ind_consegna=%s
        WHERE id_cliente=%s
    """, [
        data.get('nome', row['nome']),
        data.get('cognome', row['cognome']),
        data.get('email', row['email']),
        data.get('ind_consegna', row['ind_consegna']),
        id
    ])
    return jsonify({"message": "Cliente aggiornato"})

@api.route('/clienti/<int:id>', methods=['DELETE'])
def delete_cliente(id):
    row = query_db("SELECT * FROM clienti WHERE id_cliente = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Cliente non trovato"}), 404
    ordini = query_db("SELECT COUNT(*) as n FROM ordine WHERE id_cliente = %s", [id], one=True)
    if ordini['n'] > 0:
        return jsonify({"error": f"Impossibile eliminare: il cliente ha {ordini['n']} ordini collegati"}), 409
    recensioni = query_db("SELECT COUNT(*) as n FROM recensioni WHERE id_cliente = %s", [id], one=True)
    if recensioni['n'] > 0:
        return jsonify({"error": f"Impossibile eliminare: il cliente ha {recensioni['n']} recensioni collegate"}), 409
    mutate_db("DELETE FROM clienti WHERE id_cliente = %s", [id])
    return jsonify({"message": "Cliente eliminato"})

# ─────────────────────────────────────────────
#  FATTORINO
# ─────────────────────────────────────────────

@api.route('/fattorini', methods=['GET'])
def get_fattorini():
    disponibile = request.args.get('disponibile', '')
    query = "SELECT * FROM fattorino WHERE 1=1"
    args = []
    if disponibile != '':
        query += " AND disponibile = %s"
        args.append(disponibile)
    rows = query_db(query + " ORDER BY nome", args)
    return jsonify([dict(r) for r in rows])

@api.route('/fattorini/<int:id>', methods=['GET'])
def get_fattorino(id):
    row = query_db("SELECT * FROM fattorino WHERE id_fattorino = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Fattorino non trovato"}), 404
    return jsonify(dict(row))

@api.route('/fattorini', methods=['POST'])
def create_fattorino():
    data = request.get_json()
    required = ['nome', 'mezzo']
    for field in required:
        if not data or not data.get(field):
            return jsonify({"error": f"Campo '{field}' obbligatorio"}), 400
    new_id = mutate_db(
        "INSERT INTO fattorino (nome, mezzo, disponibile) VALUES (%s, %s, %s)",
        [data['nome'], data['mezzo'], data.get('disponibile', 1)]
    )
    return jsonify({"message": "Fattorino creato", "id_fattorino": new_id}), 201

@api.route('/fattorini/<int:id>', methods=['PUT'])
def update_fattorino(id):
    row = query_db("SELECT * FROM fattorino WHERE id_fattorino = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Fattorino non trovato"}), 404
    data = request.get_json()
    mutate_db(
        "UPDATE fattorino SET nome=%s, mezzo=%s, disponibile=%s WHERE id_fattorino=%s",
        [
            data.get('nome', row['nome']),
            data.get('mezzo', row['mezzo']),
            data.get('disponibile', row['disponibile']),
            id
        ]
    )
    return jsonify({"message": "Fattorino aggiornato"})

@api.route('/fattorini/<int:id>', methods=['DELETE'])
def delete_fattorino(id):
    row = query_db("SELECT * FROM fattorino WHERE id_fattorino = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Fattorino non trovato"}), 404
    n = query_db("SELECT COUNT(*) as n FROM ordine WHERE id_fattorino = %s", [id], one=True)
    if n['n'] > 0:
        return jsonify({"error": f"Impossibile eliminare: il fattorino ha {n['n']} ordini collegati"}), 409
    mutate_db("DELETE FROM fattorino WHERE id_fattorino = %s", [id])
    return jsonify({"message": "Fattorino eliminato"})
 

# ─────────────────────────────────────────────
#  ORDINE
# ─────────────────────────────────────────────

@api.route('/ordini', methods=['GET'])
def get_ordini():
    id_cliente = request.args.get('id_cliente', '')
    stato = request.args.get('stato', '')
    query = """
        SELECT o.*,
               c.nome AS cliente_nome, c.cognome AS cliente_cognome,
               f.nome AS fattorino_nome
        FROM ordine o
        JOIN clienti c ON o.id_cliente = c.id_cliente
        LEFT JOIN fattorino f ON o.id_fattorino = f.id_fattorino
        WHERE 1=1
    """
    args = []
    if id_cliente:
        query += " AND o.id_cliente = %s"
        args.append(id_cliente)
    if stato:
        query += " AND o.stato = %s"
        args.append(stato)
    query += " ORDER BY o.data_ora DESC"
    rows = query_db(query, args)
    return jsonify([dict(r) for r in rows])

@api.route('/ordini/<int:id>', methods=['GET'])
def get_ordine(id):
    row = query_db("""
        SELECT o.*,
               c.nome AS cliente_nome, c.cognome AS cliente_cognome,
               f.nome AS fattorino_nome
        FROM ordine o
        JOIN clienti c ON o.id_cliente = c.id_cliente
        LEFT JOIN fattorino f ON o.id_fattorino = f.id_fattorino
        WHERE o.id_ordine = %s
    """, [id], one=True)
    if not row:
        return jsonify({"error": "Ordine non trovato"}), 404
    dettagli = query_db("""
        SELECT d.*, p.nome AS piatto_nome
        FROM dettaglio_ordine d
        JOIN piatto p ON d.id_piatto = p.id_piatto
        WHERE d.id_ordine = %s
    """, [id])
    result = dict(row)
    result['dettagli'] = [dict(d) for d in dettagli]
    return jsonify(result)

@api.route('/ordini', methods=['POST'])
def create_ordine():
    data = request.get_json()
    required = ['id_cliente', 'id_fattorino']
    for field in required:
        if not data or data.get(field) is None:
            return jsonify({"error": f"Campo '{field}' obbligatorio"}), 400
    dettagli = data.get('dettagli', [])
    if not dettagli:
        return jsonify({"error": "L'ordine deve contenere almeno un piatto"}), 400
    totale = sum(d.get('prez_unit', 0) * d.get('quantita', 1) for d in dettagli)
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO ordine (id_cliente, id_fattorino, stato, totale) VALUES (%s, %s, %s, %s)",
                [data['id_cliente'], data['id_fattorino'], data.get('stato', 'in attesa'), totale]
            )
            new_id = cur.lastrowid
            for d in dettagli:
                cur.execute(
                    "INSERT INTO dettaglio_ordine (id_ordine, id_piatto, quantita, prez_unit) VALUES (%s, %s, %s, %s)",
                    [new_id, d['id_piatto'], d.get('quantita', 1), d['prez_unit']]
                )
        conn.commit()
        return jsonify({"message": "Ordine creato", "id_ordine": new_id, "totale": totale}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@api.route('/ordini/<int:id>', methods=['PUT'])
def update_ordine(id):
    row = query_db("SELECT * FROM ordine WHERE id_ordine = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Ordine non trovato"}), 404
    data = request.get_json()
    stati_validi = ['in attesa', 'confermato', 'in consegna', 'consegnato', 'annullato']
    nuovo_stato = data.get('stato', row['stato'])
    if nuovo_stato not in stati_validi:
        return jsonify({"error": f"Stato non valido. Valori ammessi: {stati_validi}"}), 400
    mutate_db(
        "UPDATE ordine SET stato=%s, id_fattorino=%s WHERE id_ordine=%s",
        [nuovo_stato, data.get('id_fattorino', row['id_fattorino']), id]
    )
    return jsonify({"message": "Ordine aggiornato"})

@api.route('/ordini/<int:id>', methods=['DELETE'])
def delete_ordine(id):
    row = query_db("SELECT * FROM ordine WHERE id_ordine = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Ordine non trovato"}), 404

    mutate_db("DELETE FROM dettaglio_ordine WHERE id_ordine = %s", [id])
    mutate_db("DELETE FROM ordine WHERE id_ordine = %s", [id])
    return jsonify({"message": "Ordine eliminato"})

# ─────────────────────────────────────────────
#  RECENSIONI
# ─────────────────────────────────────────────

@api.route('/recensioni', methods=['GET'])
def get_recensioni():
    id_ristorante = request.args.get('id_ristorante', '')
    voto_min = request.args.get('voto_min', '')
    query = """
        SELECT rec.*,
               c.nome AS cliente_nome, c.cognome AS cliente_cognome,
               r.nome AS ristorante_nome
        FROM recensioni rec
        JOIN clienti c ON rec.id_cliente = c.id_cliente
        JOIN ristorante r ON rec.id_ristorante = r.id_ristorante
        WHERE 1=1
    """
    args = []
    if id_ristorante:
        query += " AND rec.id_ristorante = %s"
        args.append(id_ristorante)
    if voto_min:
        query += " AND rec.voto >= %s"
        args.append(voto_min)
    rows = query_db(query, args)
    return jsonify([dict(r) for r in rows])

@api.route('/recensioni/<int:id>', methods=['GET'])
def get_recensione(id):
    row = query_db("""
        SELECT rec.*,
               c.nome AS cliente_nome, c.cognome AS cliente_cognome,
               r.nome AS ristorante_nome
        FROM recensioni rec
        JOIN clienti c ON rec.id_cliente = c.id_cliente
        JOIN ristorante r ON rec.id_ristorante = r.id_ristorante
        WHERE rec.id_recensione = %s
    """, [id], one=True)
    if not row:
        return jsonify({"error": "Recensione non trovata"}), 404
    return jsonify(dict(row))

@api.route('/recensioni', methods=['POST'])
def create_recensione():
    data = request.get_json()
    required = ['id_cliente', 'id_ristorante', 'voto']
    for field in required:
        if not data or data.get(field) is None:
            return jsonify({"error": f"Campo '{field}' obbligatorio"}), 400
    if not (1 <= int(data['voto']) <= 5):
        return jsonify({"error": "Il voto deve essere compreso tra 1 e 5"}), 400
    new_id = mutate_db(
        "INSERT INTO recensioni (id_cliente, id_ristorante, commento, voto) VALUES (%s, %s, %s, %s)",
        [data['id_cliente'], data['id_ristorante'], data.get('commento', ''), data['voto']]
    )
    return jsonify({"message": "Recensione creata", "id_recensione": new_id}), 201

@api.route('/recensioni/<int:id>', methods=['PUT'])
def update_recensione(id):
    row = query_db("SELECT * FROM recensioni WHERE id_recensione = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Recensione non trovata"}), 404
    data = request.get_json()
    nuovo_voto = data.get('voto', row['voto'])
    if not (1 <= int(nuovo_voto) <= 5):
        return jsonify({"error": "Il voto deve essere compreso tra 1 e 5"}), 400
    mutate_db(
        "UPDATE recensioni SET commento=%s, voto=%s WHERE id_recensione=%s",
        [data.get('commento', row['commento']), nuovo_voto, id]
    )
    return jsonify({"message": "Recensione aggiornata"})

@api.route('/recensioni/<int:id>', methods=['DELETE'])
def delete_recensione(id):
    row = query_db("SELECT * FROM recensioni WHERE id_recensione = %s", [id], one=True)
    if not row:
        return jsonify({"error": "Recensione non trovata"}), 404
    mutate_db("DELETE FROM recensioni WHERE id_recensione = %s", [id])
    return jsonify({"message": "Recensione eliminata"})

# ─────────────────────────────────────────────
#  HEALTH CHECK
# ─────────────────────────────────────────────

@api.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Food Delivery API running"})