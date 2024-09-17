import requests
from bs4 import BeautifulSoup
import json
import time
import random
import re

# Fonction pour nettoyer les requêtes de recherche
def sanitize_query(query):
    # Conserver uniquement les caractères alphanumériques et certains symboles
    return re.sub(r'[^\w\s%&]', '', query)

# Fonction pour récupérer les résultats Google
def search_google(query, num_results=5, retries=3):
    search_url = f"https://www.google.com/search?q={query}&num={num_results}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    attempt = 0
    while attempt < retries:
        try:
            response = requests.get(search_url, headers=headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                search_results = []
                
                for g in soup.find_all('div', class_='tF2Cxc'):
                    title = g.find('h3').text if g.find('h3') else 'No title'
                    link = g.find('a')['href'] if g.find('a') else 'No link'
                    
                    snippet_tag = g.find('span', class_='aCOpRe') or g.find('div', class_='VwiC3b')
                    snippet = snippet_tag.text if snippet_tag else 'Snippet non disponible'
                    
                    search_results.append({
                        "title": title,
                        "snippet": snippet,
                        "link": link
                    })
                
                if search_results:
                    return search_results
                else:
                    print(f"Aucun résultat trouvé pour la requête '{query}' sur Google.")
                    return []
            else:
                attempt += 1
                wait_time = 2 ** attempt
                print(f"Erreur {response.status_code} lors de la recherche Google. Tentative {attempt} après {wait_time} secondes.")
                time.sleep(wait_time)
        except Exception as e:
            print(f"Erreur lors de la requête Google : {e}")
            attempt += 1
            wait_time = 2 ** attempt
            time.sleep(wait_time)
    
    print(f"Échec après {retries} tentatives sur Google.")
    return []

# Fonction pour récupérer les résultats Bing
def search_bing(query, num_results=5, retries=3):
    search_url = f"https://www.bing.com/search?q={query}&count={num_results}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    attempt = 0
    while attempt < retries:
        try:
            response = requests.get(search_url, headers=headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                search_results = []
                
                for g in soup.find_all('li', class_='b_algo'):
                    title = g.find('h2').text if g.find('h2') else 'No title'
                    link = g.find('a')['href'] if g.find('a') else 'No link'
                    
                    snippet_tag = g.find('p')
                    snippet = snippet_tag.text if snippet_tag else 'Snippet non disponible'
                    
                    search_results.append({
                        "title": title,
                        "snippet": snippet,
                        "link": link
                    })
                
                if search_results:
                    return search_results
                else:
                    print(f"Aucun résultat trouvé pour la requête '{query}' sur Bing.")
                    return []
            else:
                attempt += 1
                wait_time = 2 ** attempt
                print(f"Erreur {response.status_code} lors de la recherche Bing. Tentative {attempt} après {wait_time} secondes.")
                time.sleep(wait_time)
        except Exception as e:
            print(f"Erreur lors de la requête Bing : {e}")
            attempt += 1
            wait_time = 2 ** attempt
            time.sleep(wait_time)
    
    print(f"Échec après {retries} tentatives sur Bing.")
    return []

# Fonction pour récupérer les résultats Yahoo
def search_yahoo(query, num_results=5, retries=3):
    search_url = f"https://search.yahoo.com/search?p={query}&n={num_results}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    attempt = 0
    while attempt < retries:
        try:
            response = requests.get(search_url, headers=headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                search_results = []
                
                for g in soup.find_all('div', class_='dd algo'):
                    title = g.find('h3').text if g.find('h3') else 'No title'
                    link = g.find('a')['href'] if g.find('a') else 'No link'
                    
                    snippet_tag = g.find('p')
                    snippet = snippet_tag.text if snippet_tag else 'Snippet non disponible'
                    
                    search_results.append({
                        "title": title,
                        "snippet": snippet,
                        "link": link
                    })
                
                if search_results:
                    return search_results
                else:
                    print(f"Aucun résultat trouvé pour la requête '{query}' sur Yahoo.")
                    return []
            else:
                attempt += 1
                wait_time = 2 ** attempt
                print(f"Erreur {response.status_code} lors de la recherche Yahoo. Tentative {attempt} après {wait_time} secondes.")
                time.sleep(wait_time)
        except Exception as e:
            print(f"Erreur lors de la requête Yahoo : {e}")
            attempt += 1
            wait_time = 2 ** attempt
            time.sleep(wait_time)
    
    print(f"Échec après {retries} tentatives sur Yahoo.")
    return []

# Fonction pour récupérer les résultats Qwant
def search_qwant(query, num_results=5, retries=3):
    search_url = f"https://www.qwant.com/?q={query}&count={num_results}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    attempt = 0
    while attempt < retries:
        try:
            response = requests.get(search_url, headers=headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                search_results = []
                
                for g in soup.find_all('div', class_='result'):
                    title = g.find('h2').text if g.find('h2') else 'No title'
                    link = g.find('a')['href'] if g.find('a') else 'No link'
                    
                    snippet_tag = g.find('p')
                    snippet = snippet_tag.text if snippet_tag else 'Snippet non disponible'
                    
                    search_results.append({
                        "title": title,
                        "snippet": snippet,
                        "link": link
                    })
                
                if search_results:
                    return search_results
                else:
                    print(f"Aucun résultat trouvé pour la requête '{query}' sur Qwant.")
                    return []
            else:
                attempt += 1
                wait_time = 2 ** attempt
                print(f"Erreur {response.status_code} lors de la recherche Qwant. Tentative {attempt} après {wait_time} secondes.")
                time.sleep(wait_time)
        except Exception as e:
            print(f"Erreur lors de la requête Qwant : {e}")
            attempt += 1
            wait_time = 2 ** attempt
            time.sleep(wait_time)
    
    print(f"Échec après {retries} tentatives sur Qwant.")
    return []

# Fonction pour récupérer les résultats Ecosia
def search_ecosia(query, num_results=5, retries=3):
    search_url = f"https://www.ecosia.org/search?q={query}&count={num_results}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    attempt = 0
    while attempt < retries:
        try:
            response = requests.get(search_url, headers=headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                search_results = []
                
                for g in soup.find_all('div', class_='result'):
                    title = g.find('h2').text if g.find('h2') else 'No title'
                    link = g.find('a')['href'] if g.find('a') else 'No link'
                    
                    snippet_tag = g.find('p')
                    snippet = snippet_tag.text if snippet_tag else 'Snippet non disponible'
                    
                    search_results.append({
                        "title": title,
                        "snippet": snippet,
                        "link": link
                    })
                
                if search_results:
                    return search_results
                else:
                    print(f"Aucun résultat trouvé pour la requête '{query}' sur Ecosia.")
                    return []
            else:
                attempt += 1
                wait_time = 2 ** attempt
                print(f"Erreur {response.status_code} lors de la recherche Ecosia. Tentative {attempt} après {wait_time} secondes.")
                time.sleep(wait_time)
        except Exception as e:
            print(f"Erreur lors de la requête Ecosia : {e}")
            attempt += 1
            wait_time = 2 ** attempt
            time.sleep(wait_time)
    
    print(f"Échec après {retries} tentatives sur Ecosia.")
    return []

# Fonction pour sauvegarder les résultats dans un fichier et éviter les doublons
def save_results_to_file(results, filename="result.txt"):
    if not results:
        print("Aucun résultat à sauvegarder.")
        return
    
    try:
        with open(filename, "r", encoding='utf-8') as file:
            existing_links = {json.loads(line)["link"] for line in file if line.strip()}
    except FileNotFoundError:
        existing_links = set()
    
    try:
        with open(filename, "a", encoding='utf-8') as file:
            for result in results:
                if result["link"] not in existing_links:
                    file.write(json.dumps(result, ensure_ascii=False) + "\n")
                    existing_links.add(result["link"])
    except IOError as e:
        print(f"Erreur lors de l'écriture dans le fichier {filename}: {e}")

# Fonction pour extraire les mots-clés des titres et snippets dans result.txt
def extract_keywords_from_file(filename="result.txt"):
    keywords = set()
    try:
        with open(filename, "r", encoding='utf-8') as file:
            for line in file:
                data = json.loads(line.strip())
                title_words = data.get("title", "").split()
                snippet_words = data.get("snippet", "").split()
                
                keywords.update(title_words)
                keywords.update(snippet_words)
    except FileNotFoundError:
        print(f"{filename} n'existe pas encore.")
    
    return list(keywords)

# Boucle de recherche automatique
search_interval = 8  # Intervalle de 8 secondes entre chaque recherche

while True:
    # Extraire les mots-clés des titres et snippets déjà présents dans result.txt
    search_queries = extract_keywords_from_file()
    
    if search_queries:
        # Limiter le nombre de requêtes par itération
        for _ in range(3):  
            if search_queries:
                query = random.choice(search_queries)
                sanitized_query = sanitize_query(query)
                
                if sanitized_query:  # Vérifier que la requête n'est pas vide après nettoyage
                    print(f"Recherche avec la requête: '{sanitized_query}'")
                    
                    # Rechercher sur Google, Bing, Yahoo, Qwant, et Ecosia
                    google_results = search_google(sanitized_query, num_results=5)
                    bing_results = search_bing(sanitized_query, num_results=5)
                    yahoo_results = search_yahoo(sanitized_query, num_results=5)
                    qwant_results = search_qwant(sanitized_query, num_results=5)
                    ecosia_results = search_ecosia(sanitized_query, num_results=5)
                    
                    all_results = google_results + bing_results + yahoo_results + qwant_results + ecosia_results
                    
                    if all_results:
                        # Sauvegarder les résultats sans doublons
                        save_results_to_file(all_results)
                        print(f"Résultats pour '{sanitized_query}' enregistrés dans 'result.txt'.")
                    else:
                        print(f"Aucun résultat trouvé pour la requête '{sanitized_query}'.")
                    
                    # Attendre 8 secondes avant la prochaine recherche
                    time.sleep(search_interval)
                else:
                    print("La requête après nettoyage est vide.")
                    time.sleep(search_interval)
    else:
        print("Aucun mot-clé trouvé pour lancer une nouvelle recherche.")
        # Attendre 8 secondes avant de vérifier à nouveau
        time.sleep(search_interval)
