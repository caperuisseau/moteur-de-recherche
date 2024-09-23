document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('query');

    // Charger immédiatement le fichier JSON au chargement de la page
    preloadSearchResults();

    // Vérifier si le champ de recherche est bloqué
    if (searchInput.disabled) {
        console.log('Le champ de recherche est désactivé, les recherches sont bloquées.');
    }
});

let cachedSearchResults = null;
let invertedIndex = {};
let totalDocuments = 0;

// Précharger les résultats de 'sites.json'
function preloadSearchResults() {
    fetch('sites.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau lors du chargement de sites.json.');
            }
            return response.json();
        })
        .then(searchResults => {
            cachedSearchResults = searchResults;
            totalDocuments = searchResults.length;
            createInvertedIndex(searchResults);
            console.log('Données préchargées. Les recherches seront instantanées.');
        })
        .catch(error => {
            console.error('Erreur lors du préchargement des résultats:', error);
        });
}

// Création d'un index inversé
function createInvertedIndex(documents) {
    invertedIndex = {};

    documents.forEach((doc, docIndex) => {
        const words = [...new Set([...doc.title.toLowerCase().split(/\s+/), ...doc.snippet.toLowerCase().split(/\s+/)])];

        words.forEach(word => {
            if (!invertedIndex[word]) {
                invertedIndex[word] = [];
            }
            invertedIndex[word].push(docIndex);
        });
    });
}

// Fonction de recherche
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
    resultsContainer.innerHTML = '';
    const startTime = performance.now();

    displayResults(query, startTime);
}

// Afficher les résultats de la recherche
function displayResults(query, startTime) {
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');

    const queryWords = query.split(/\s+/);
    const relevantDocs = {};

    // Rechercher les documents correspondant à la requête
    queryWords.forEach(word => {
        const regex = new RegExp(word, 'i'); // Correspondance insensible à la casse
        Object.keys(invertedIndex).forEach(indexWord => {
            if (regex.test(indexWord)) {
                invertedIndex[indexWord].forEach(docIndex => {
                    if (!relevantDocs[docIndex]) {
                        relevantDocs[docIndex] = 0;
                    }
                    relevantDocs[docIndex] += 1;
                });
            }
        });
    });

    // Filtrer les résultats pour ne garder que ceux qui contiennent tous les mots
    const results = Object.keys(relevantDocs)
        .filter(docIndex => relevantDocs[docIndex] === queryWords.length)
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
        resultsContainer.innerHTML = `<p>Aucun résultat trouvé pour "${query}".</p>`;
        suggestSimilarQueries(query);
    }

    timeTakenElement.textContent = `Résultats affichés en ${timeTaken} secondes.`;
    timeTakenElement.style.display = 'block';
}

// Fonction pour surligner les termes recherchés
function highlightQuery(text, query) {
    const words = query.split(/\s+/);
    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Suggérer des requêtes similaires
function suggestSimilarQueries(query) {
    const suggestions = Object.keys(invertedIndex)
        .filter(word => word.startsWith(query))
        .slice(0, 5) // Limiter le nombre de suggestions
        .join(', ');

    if (suggestions) {
        const suggestionsElement = document.createElement('p');
        suggestionsElement.innerHTML = `Suggestions : ${suggestions}.`;
        document.getElementById('results').appendChild(suggestionsElement);
    }
}
