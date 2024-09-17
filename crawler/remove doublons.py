import json
import time
# Fonction pour supprimer les doublons
def remove_duplicates(data):
    seen = set()
    unique_data = []
    for item in data:
        # Utiliser le lien comme clé unique
        link = item.get("link")
        if link not in seen:
            seen.add(link)
            unique_data.append(item)
    return unique_data

# Lire le fichier JSON
with open('sites.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Supprimer les doublons
cleaned_data = remove_duplicates(data)

# Écrire les données nettoyées dans un nouveau fichier
with open('sites_cleaned.json', 'w', encoding='utf-8') as file:
    json.dump(cleaned_data, file, indent=4, ensure_ascii=False)

print("Les doublons ont été supprimés et les données nettoyées ont été enregistrées dans 'sites_cleaned.json'.")
time.sleep(1)
exit()