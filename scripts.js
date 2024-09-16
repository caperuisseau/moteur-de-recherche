<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moteur de Recherche</title>
    <style>
        body { font-family: Arial, sans-serif; }
        #loading { display: none; }
        .result { margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>Recherche</h1>
    <form id="searchForm">
        <input type="text" id="query" placeholder="Entrez votre recherche..." />
        <button type="submit">Rechercher</button>
    </form>
    <div id="loading">Chargement...</div>
    <div id="results"></div>
    <div id="timeTaken"></div>

    <script>
        function search(event) {
            event.preventDefault();
            const query = document.getElementById('query').value.toLowerCase().trim();
            const resultsContainer = document.getElementById('results');
            const loading = document.getElementById('loading');
            const timeTakenElement = document.getElementById('timeTaken');
            
            loading.style.display = 'block';
            
            const startTime = performance.now(); // Start time
            
            fetch('sites.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur réseau.');
                    }
                    return response.json();
                })
                .then(searchResults => {
                    const queryWords = query.split(/\s+/);
                    const allSnippets = searchResults.map(result => result.snippet.toLowerCase());

                    function calculateTFIDF(term, document, allDocuments) {
                        const termCount = document.split(/\s+/).filter(word => word === term).length;
                        const tf = termCount / document.length;
                        const docCount = allDocuments.filter(doc => doc.includes(term)).length;
                        const idf = Math.log(allDocuments.length / (1 + docCount));
                        return tf * idf;
                    }

                    function calculateTFIDFScore(result) {
                        let score = 0;
                        queryWords.forEach(word => {
                            score += calculateTFIDF(word, result.snippet.toLowerCase(), allSnippets);
                            score += calculateTFIDF(word, result.title.toLowerCase(), allSnippets) * 2;
                        });
                        return score;
                    }

                    function calculatePowerRank(result) {
                        const tfidfScore = calculateTFIDFScore(result);
                        const popularityScore = result.views || 0;
                        return tfidfScore * 0.7 + popularityScore * 0.3;
                    }

                    const results = searchResults.filter(result => calculateTFIDFScore(result) > 0);
                    results.sort((a, b) => calculatePowerRank(b) - calculatePowerRank(a));

                    const endTime = performance.now();
                    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

                    loading.style.display = 'none';

                    if (results.length > 0) {
                        resultsContainer.innerHTML = '';
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

        document.getElementById('searchForm').addEventListener('submit', search);
    </script>
</body>
</html>
