import sqlite3
import json

# Connexion à la base de données (ou création si elle n'existe pas)
conn = sqlite3.connect('crawler_results.db')
cursor = conn.cursor()

# Création de la table si elle n'existe pas déjà
cursor.execute('''
    CREATE TABLE IF NOT EXISTS results (
        title TEXT,
        snippet TEXT,
        link TEXT
    )
''')

# Ouverture du fichier result.txt
with open('result.txt', 'r', encoding='utf-8') as file:
    for line in file:
        # Chargement de chaque ligne JSON
        result = json.loads(line.strip())
        
        # Insertion dans la base de données
        cursor.execute('''
            INSERT INTO results (title, snippet, link) VALUES (?, ?, ?)
        ''', (result['title'], result['snippet'], result['link']))

# Sauvegarde et fermeture de la connexion
conn.commit()
conn.close()
