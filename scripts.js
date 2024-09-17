// Caching the search results globally to avoid multiple fetch calls
let cachedSearchResults = null;

// Fonction pour gérer la recherche
function search(event) {
    event.preventDefault();
    const query = document.getElementById('query').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');
    
    if (!query || query.length < 2) {
        resultsContainer.innerHTML = '<p>Veuillez entrer un terme de recherche plus précis.</p>';
        return; // Si la requête est vide ou trop courte, on ne fait rien
    }

    loading.style.display = 'block'; // Affiche le message de chargement
    resultsContainer.innerHTML = ''; // Vide les résultats précédents
    const startTime = performance.now(); // Temps de début

    // Si les résultats sont déjà mis en cache, on les utilise
    if (cachedSearchResults) {
        displayResults(cachedSearchResults, query, startTime);
    } else {
        // Charger le fichier JSON
        fetch('sites.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau.');
                }
                return response.json();
            })
            .then(searchResults => {
                cachedSearchResults = searchResults; // Mise en cache
                displayResults(searchResults, query, startTime);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des résultats :', error);
                loading.style.display = 'none';
                resultsContainer.innerHTML = '<p>Erreur lors du chargement des résultats.</p>';
            });
    }
}

// Fonction pour afficher les résultats
function displayResults(searchResults, query, startTime) {
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');

    // Fonction pour vérifier les correspondances avec poids
    function match(text, query) {
        const words = query.split(/\s+/); // Diviser la requête en mots
        let score = 0;
        words.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Match mot exact
            const matches = (text.match(regex) || []).length;
            score += matches;
        });
        return score;
    }

    // Filtrer et donner des scores
    const results = searchResults.map(result => {
        const titleScore = match(result.title.toLowerCase(), query);
        const snippetScore = match(result.snippet.toLowerCase(), query);
        return {
            ...result,
            score: titleScore * 2 + snippetScore // Donner plus de poids au titre
        };
    }).filter(result => result.score > 0); // Garder les résultats pertinents

    // Tri des résultats par score décroissant
    results.sort((a, b) => b.score - a.score);

    const endTime = performance.now(); // Temps de fin
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Temps en secondes

    loading.style.display = 'none'; // Cache le message de chargement

    if (results.length > 0) {
        resultsContainer.innerHTML = ''; // Efface les résultats précédents
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

// Fonction pour surligner les termes de recherche dans les résultats
function highlightQuery(text, query) {
    const words = query.split(/\s+/);
    const regex = new RegExp(`(${words.join('|')})`, 'gi'); // Créer une regex avec les termes de recherche
    return text.replace(regex, '<mark>$1</mark>'); // Surligner les termes correspondants
}

document.getElementById('searchForm').addEventListener('submit', search);
