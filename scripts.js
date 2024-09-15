function search(event) {
    event.preventDefault();
    const query = document.getElementById('query').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');

    loading.style.display = 'block';

    const startTime = performance.now(); // Start time

    // Fonction pour normaliser le texte (retirer les accents et convertir en minuscule)
    function normalizeText(text) {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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

    // Charger le fichier JSON
    fetch('sites.json')
        .then(response => response.json())
        .then(searchResults => {
            // Filtrer les résultats
            const results = searchResults.filter(result =>
                match(result.title, query) ||
                match(result.snippet, query)
            );

            // Tri des résultats par pertinence
            results.sort((a, b) => {
                return (match(a.title, query) ? 1 : 0) - (match(b.title, query) ? 1 : 0) ||
                    (match(a.snippet, query) ? 1 : 0) - (match(b.snippet, query) ? 1 : 0);
            });

            const endTime = performance.now(); // End time
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Time in seconds

            loading.style.display = 'none';

            if (results.length > 0) {
                resultsContainer.innerHTML = ''; // Clear previous results
                results.forEach(result => {
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
        })
        .catch(error => {
            console.error('Erreur lors du chargement des résultats :', error);
            loading.style.display = 'none';
            resultsContainer.innerHTML = '<p>Erreur lors du chargement des résultats.</p>';
        });
}
