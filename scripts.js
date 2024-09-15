let currentPage = 1;
const resultsPerPage = 10;

// Fonction pour normaliser le texte (retirer les accents et convertir en minuscule)
function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Fonction pour calculer le score de pertinence
function calculateScore(result, query) {
    const normalizedQuery = normalizeText(query);
    const normalizedTitle = normalizeText(result.title);
    const normalizedSnippet = normalizeText(result.snippet);

    let score = 0;
    if (normalizedTitle.includes(normalizedQuery)) {
        score += 10; // Score élevé pour le titre
    }
    if (normalizedSnippet.includes(normalizedQuery)) {
        score += 5; // Score moyen pour l'extrait
    }
    return score;
}

// Fonction pour mettre en surbrillance les résultats
function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Fonction pour mettre à jour les suggestions de recherche
function updateSuggestions(query) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';

    if (query.length > 1) {
        fetch('sites.json')
            .then(response => response.json())
            .then(data => {
                const suggestions = data
                    .map(site => site.title)
                    .filter(title => normalizeText(title).startsWith(normalizeText(query)));

                suggestions.forEach(suggestion => {
                    const suggestionElement = document.createElement('div');
                    suggestionElement.classList.add('suggestion');
                    suggestionElement.textContent = suggestion;
                    suggestionElement.onclick = () => {
                        document.getElementById('query').value = suggestion;
                        suggestionsContainer.innerHTML = '';
                        search(event);
                    };
                    suggestionsContainer.appendChild(suggestionElement);
                });
            });
    }
}

// Fonction de recherche
function search(event) {
    event.preventDefault();
    const query = document.getElementById('query').value.toLowerCase();
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');
    
    loading.style.display = 'block';

    const startTime = performance.now(); // Start time

    // Charger le fichier JSON
    fetch('sites.json')
        .then(response => response.json())
        .then(data => {
            const results = data
                .map(result => ({
                    ...result,
                    score: calculateScore(result, query)
                }))
                .filter(result => result.score > 0) // Only include results with a score
                .sort((a, b) => b.score - a.score); // Sort by score

            // Paginer les résultats
            const totalResults = results.length;
            const startIndex = (currentPage - 1) * resultsPerPage;
            const paginatedResults = results.slice(startIndex, startIndex + resultsPerPage);

            const endTime = performance.now(); // End time
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Time in seconds

            loading.style.display = 'none';

            if (paginatedResults.length > 0) {
                resultsContainer.innerHTML = ''; // Clear previous results
                paginatedResults.forEach(result => {
                    const resultElement = document.createElement('div');
                    resultElement.classList.add('result');
                    resultElement.innerHTML = `
                        <a href="${result.link}" target="_blank">${highlightText(result.title, query)}</a>
                        <p>${highlightText(result.snippet, query)}</p>
                    `;
                    resultsContainer.appendChild(resultElement);
                });
            } else {
                resultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
            }

            timeTakenElement.textContent = `Les résultats ont été affichés en ${timeTaken} secondes.`;
            timeTakenElement.style.display = 'block';

            // Mettre à jour la pagination
            document.getElementById('prevPage').disabled = currentPage === 1;
            document.getElementById('nextPage').disabled = currentPage * resultsPerPage >= totalResults;
        })
        .catch(error => {
            console.error('Erreur lors du chargement des résultats :', error);
            loading.style.display = 'none';
            resultsContainer.innerHTML = '<p>Erreur lors du chargement des résultats.</p>';
        });
}

// Fonction pour changer de page
function changePage(direction) {
    currentPage += direction;
    search(event);
}

// Écouter les entrées de recherche pour mettre à jour les suggestions
document.getElementById('query').addEventListener('input', (event) => {
    updateSuggestions(event.target.value);
});
