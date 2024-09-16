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
            // Diviser la requête en mots
            const queryWords = query.split(/\s+/);

            // Calculer TF-IDF pour chaque document
            const allSnippets = searchResults.map(result => result.snippet.toLowerCase());

            function calculateTFIDFScore(result) {
                let score = 0;
                queryWords.forEach(word => {
                    score += calculateTFIDF(word, result.snippet.toLowerCase(), allSnippets);
                    score += calculateTFIDF(word, result.title.toLowerCase(), allSnippets) * 2; // Priorité pour le titre
                });
                return score;
            }

            // Ajouter la popularité (comme le nombre de vues) pour ajuster le classement
            function calculatePowerRank(result) {
                const tfidfScore = calculateTFIDFScore(result);
                const popularityScore = result.views || 0;
                return tfidfScore * 0.7 + popularityScore * 0.3;
            }

            // Filtrer et trier les résultats
            const results = searchResults.filter(result => calculateTFIDFScore(result) > 0);
            results.sort((a, b) => calculatePowerRank(b) - calculatePowerRank(a));

            const endTime = performance.now();
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

            loading.style.display = 'none';

            if (results.length > 0) {
                resultsContainer.innerHTML = ''; // Clear previous results
                results.forEach(result => {
                    const resultElement = document.createElement('div');
                    resultElement.classList.add('result');
                    resultElement.innerHTML = `
                        <a href="${result.link}" target="_blank">${result.title}</a>
                        <p>${result.snippet}</p>
                        <p><strong>Popularité :</strong> ${result.views || 0} vues</p>
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
