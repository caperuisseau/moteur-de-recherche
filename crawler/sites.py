import sqlite3
import json

# Connexion à la base de données SQLite
conn = sqlite3.connect('crawler_results.db')
cursor = conn.cursor()

# Exécuter une requête pour récupérer toutes les données
cursor.execute('SELECT title, snippet, link FROM results')
rows = cursor.fetchall()

# Créer une liste de dictionnaires pour stocker les résultats
results = []
for row in rows:
    results.append({
        "title": row[0],
        "snippet": row[1],
        "link": row[2]
    })

# Écrire les résultats dans un fichier JSON
with open('sites.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=4)

# Fermer la connexion
conn.close()
