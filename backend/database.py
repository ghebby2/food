import pymysql
import pymysql.cursors
DB_CONFIG = {
    "host":     "gateway01.eu-central-1.prod.aws.tidbcloud.com",
    "port":     4000,
    "user":     "2SZc5k7KdZYPqyW.root",
    "password": "EAzo9YQJFqmrdGyr",
    "database": "Food",
    "cursorclass": pymysql.cursors.DictCursor,
    "ssl": {"ca": None},          # TiDB Cloud richiede TLS
    "connect_timeout": 10,
}
def get_db():
    conn = pymysql.connect(**DB_CONFIG)
    return conn
def query_db(query, args=(), one=False):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(query, args)
            rv = cur.fetchall()
        return (rv[0] if rv else None) if one else rv
    finally:
        conn.close()
def mutate_db(query, args=()):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(query, args)
        conn.commit()
        return cur.lastrowid
    finally:
        conn.close()