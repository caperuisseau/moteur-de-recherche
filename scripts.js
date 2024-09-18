document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById('query');
    
    // Charger les résultats dès que la page est prête
    preloadSearchResults();

    if (searchForm) {
        // Vérifie si l'input est désactivé
        if (searchInput.disabled) {
            console.warn('La recherche est actuellement bloquée.');
            return; // Ne fait rien car la recherche est désactivée
        }
        
        searchForm.addEventListener('submit', search);
    } else {
        console.error('Le formulaire de recherche est introuvable.');
    }
});

let cachedSearchResults = null;
let invertedIndex = {};
let totalDocuments = 0;

// Précharger les résultats au chargement de la page
function preloadSearchResults() {
    fetch('sites.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau.');
            }
            return response.json();
        })
        .then(searchResults => {
            cachedSearchResults = searchResults; // Stocker les résultats
            totalDocuments = searchResults.length;
            createInvertedIndex(searchResults); // Créer l'index inversé immédiatement
            console.log('Données préchargées et index créé. Prêt pour la recherche.');
        })
        .catch(error => {
            console.error('Erreur lors du préchargement des résultats:', error);
        });
}

// Fonction principale de gestion de la recherche
function search(event) {
    event.preventDefault();
    
    const query = document.getElementById('query').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');

    if (!query) {
        resultsContainer.innerHTML = '<p>Veuillez entrer un terme de recherche.</p>';
        return;
    }

    loading.style.display = 'block';
    resultsContainer.innerHTML = ''; // Effacer les résultats précédents
    const startTime = performance.now();

    // Les résultats sont déjà en cache grâce au préchargement
    displayResults(query, startTime);
}

// Création d'un index inversé simple
function createInvertedIndex(documents) {
    invertedIndex = {}; // Réinitialiser l'index précédent

    documents.forEach((doc, docIndex) => {
        const words = [...new Set([...doc.title.toLowerCase().split(/\s+/), ...doc.snippet.toLowerCase().split(/\s+/)])];

        words.forEach(word => {
            if (!invertedIndex.hasOwnProperty(word)) {
                invertedIndex[word] = [];
            }
            if (Array.isArray(invertedIndex[word])) {
                invertedIndex[word].push(docIndex);
            }
        });
    });
}

// Affichage des résultats de recherche
function displayResults(query, startTime) {
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');

    const queryWords = query.split(/\s+/);
    const relevantDocs = {};

    // Récupérer les documents pertinents pour chaque mot de la requête
    queryWords.forEach(word => {
        if (invertedIndex[word]) {
            invertedIndex[word].forEach(docIndex => {
                if (!relevantDocs[docIndex]) {
                    relevantDocs[docIndex] = 0;
                }
                relevantDocs[docIndex] += 1; // Compter les occurrences des mots de la requête
            });
        }
    });

    // Trier les documents en fonction de la pertinence (nombre d'occurrences)
    const results = Object.keys(relevantDocs)
        .map(docIndex => ({
            ...cachedSearchResults[docIndex],
            score: relevantDocs[docIndex]
        }))
        .sort((a, b) => b.score - a.score);

    const endTime = performance.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    loading.style.display = 'none';

    if (results.length > 0) {
        resultsContainer.innerHTML = '';
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.classList.add('result');
            resultElement.innerHTML = `
                <a href="${result.link}" target="_blank">${highlightQuery(result.title, query)}</a>
                <p>${highlightQuery(result.snippet, query)}</p>
            `;
            resultsContainer.appendChild(resultElement);
        });
    } else {
        resultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
    }

    timeTakenElement.textContent = `Les résultats ont été affichés en ${timeTaken} secondes.`;
    timeTakenElement.style.display = 'block';
}

// Fonction pour surligner les termes de la requête dans les résultats
function highlightQuery(text, query) {
    const words = query.split(/\s+/);
    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}
