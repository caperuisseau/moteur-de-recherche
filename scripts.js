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

// Fonction pour vérifier les correspondances
function match(text, query) {
    const normalizedText = normalizeText(text);
    const normalizedQuery = normalizeText(query);
    return normalizedText.includes(normalizedQuery);
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
                    .filter(title => title.toLowerCase().startsWith(query.toLowerCase()));

                suggestions.forEach(suggestion => {
                    const suggestionElement = document.createElement('div');
                    suggestionElement.classList.add('suggestion');
                    suggestionElement.textContent = suggestion;
                    suggestionElement.onclick = () => {
                        document.getElementById('query').value = suggestion;
                        search(new Event('submit')); // Trigger search with the selected suggestion
                    };
                    suggestionsContainer.appendChild(suggestionElement);
                });
            });
    }
}

// Fonction pour gérer les changements de page
function changePage(direction) {
    currentPage += direction;
    search(new Event('submit')); // Rechercher de nouveau avec la page mise à jour
}

// Fonction principale de recherche
function search(event) {
    event.preventDefault();
    const query = document.getElementById('query').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');

    loading.style.display = 'block';

    const startTime = performance.now(); // Start time

    fetch('sites.json')
        .then(response => response.json())
        .then(searchResults => {
            // Filtrer et noter les résultats
            const results = searchResults.map(result => ({
                ...result,
                score: calculateScore(result, query)
            })).filter(result => result.score > 0);

            // Trier les résultats par score
            results.sort((a, b) => b.score - a.score);

            // Pagination
            const totalResults = results.length;
            const totalPages = Math.ceil(totalResults / resultsPerPage);
            const paginatedResults = results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

            const endTime = performance.now(); // End time
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Time in seconds

            loading.style.display = 'none';

            if (paginatedResults.length > 0) {
                resultsContainer.innerHTML = '';
                paginatedResults.forEach(result => {
                    const resultElement = document.createElement('div');
                    resultElement.classList.add('result');
                    resultElement.innerHTML = `
                        <a href="${result.link}" target="_blank">${highlightText(result.title, query)}</a>
                        <p>${highlightText(result.snippet, query)}</p>
                    `;
                    resultsContainer.appendChild(resultElement);
                });

                // Mettre à jour les boutons de pagination
                document.getElementById('prevPage').style.display = (currentPage > 1) ? 'inline' : 'none';
                document.getElementById('nextPage').style.display = (currentPage < totalPages) ? 'inline' : 'none';
            } else {
                resultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
            }

            timeTakenElement.textContent = `Les résultats ont été affichés en ${timeTaken} secondes.`;
            timeTakenElement.style.display = 'block';
        })
        .catch(error => {
            console.error('Erreur lors du chargement des résultats :', error);
            loading.style.display = 'none';
            resultsContainer.innerHTML = '<p>Erreur lors du chargement des résultats.</p>';
        });
}

// Appelle updateSuggestions à chaque frappe dans le champ de recherche
document.getElementById('query').addEventListener('input', function() {
    updateSuggestions(this.value);
});
