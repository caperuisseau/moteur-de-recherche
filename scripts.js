// Fonction pour calculer TF (Term Frequency)
function termFrequency(term, document) {
    const words = document.split(/\s+/); // Séparer en mots
    const termCount = words.filter(word => word === term).length; // Compter les occurrences du terme
    return termCount / words.length; // Diviser par le nombre total de mots
}

// Fonction pour calculer IDF (Inverse Document Frequency)
function inverseDocumentFrequency(term, allDocuments) {
    const numDocsContainingTerm = allDocuments.filter(doc => doc.toLowerCase().includes(term)).length;
    return Math.log(allDocuments.length / (1 + numDocsContainingTerm)); // +1 pour éviter division par 0
}

// Fonction pour calculer TF-IDF
function calculateTFIDF(term, document, allDocuments) {
    const tf = termFrequency(term, document);
    const idf = inverseDocumentFrequency(term, allDocuments);
    return tf * idf;
}

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

            // Fonction pour calculer le score de pertinence TF-IDF pour un résultat donné
            function calculateTFIDFScore(result) {
                let score = 0;
                queryWords.forEach(word => {
                    score += calculateTFIDF(word, result.snippet.toLowerCase(), allSnippets);
                    score += calculateTFIDF(word, result.title.toLowerCase(), allSnippets) * 2; // Plus de poids pour le titre
                });
                return score;
            }

            // Ajouter la popularité pour ajuster le classement
            function calculatePowerRank(result) {
                const tfidfScore = calculateTFIDFScore(result);
                const popularityScore = result.views || 0; // Popularité basée sur les vues
                return tfidfScore * 0.7 + popularityScore * 0.3;
            }

            // Filtrer et trier les résultats en fonction du PowerRank
            const results = searchResults.filter(result => calculateTFIDFScore(result) > 0);
            results.sort((a, b) => calculatePowerRank(b) - calculatePowerRank(a));

            const endTime = performance.now();
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

            loading.style.display = 'none';

            if (results.length > 0) {
                resultsContainer.innerHTML = ''; // Vider les résultats précédents
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
