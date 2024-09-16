window.onload = function() {
    let cachedResults = []; // Cache des résultats pour éviter les multiples fetch

    // Fonction pour calculer la fréquence du terme (TF)
    function termFrequency(term, document) {
        const words = document.split(/\s+/);
        const termCount = words.filter(word => word === term).length;
        return termCount / words.length;
    }

    // Fonction pour calculer l'inverse de la fréquence dans le document (IDF)
    function inverseDocumentFrequency(term, allDocuments) {
        const numDocsContainingTerm = allDocuments.filter(doc => doc.includes(term)).length;
        return Math.log(allDocuments.length / (1 + numDocsContainingTerm));
    }

    // Calculer le score TF-IDF
    function calculateTFIDF(term, document, allDocuments) {
        const tf = termFrequency(term, document);
        const idf = inverseDocumentFrequency(term, allDocuments);
        return tf * idf;
    }

    // Calculer le score TF-IDF pour un résultat donné
    function calculateTFIDFScore(result, queryWords, allSnippets) {
        let score = 0;
        queryWords.forEach(word => {
            score += calculateTFIDF(word, result.snippet.toLowerCase(), allSnippets);
            score += calculateTFIDF(word, result.title.toLowerCase(), allSnippets) * 2; // Titre plus important
        });
        return score;
    }

    // Calculer le PowerRank
    function calculatePowerRank(result, queryWords, allSnippets) {
        const tfidfScore = calculateTFIDFScore(result, queryWords, allSnippets);
        const popularityScore = result.views || 0; // Popularité (basée sur les vues)
        return tfidfScore * 0.7 + popularityScore * 0.3;
    }

    // Fonction pour gérer la recherche
    function search(event) {
        event.preventDefault();
        const query = document.getElementById('query').value.toLowerCase().trim();
        const resultsContainer = document.getElementById('results');
        const loading = document.getElementById('loading');
        const timeTakenElement = document.getElementById('timeTaken');
        const paginationElement = document.getElementById('pagination');
        
        if (!query) return;

        loading.style.display = 'block';
        resultsContainer.innerHTML = '';
        paginationElement.innerHTML = '';
        
        const startTime = performance.now(); // Start time

        // Si les résultats sont déjà mis en cache, on les utilise
        if (cachedResults.length > 0) {
            displayResults(query, cachedResults, startTime);
            return;
        }

        // Sinon, on charge les résultats depuis le fichier JSON
        fetch('sites.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau.');
                }
                return response.json();
            })
            .then(searchResults => {
                cachedResults = searchResults; // Mise en cache des résultats
                displayResults(query, searchResults, startTime);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des résultats :', error);
                loading.style.display = 'none';
                resultsContainer.innerHTML = '<p>Erreur lors du chargement des résultats.</p>';
            });
    }

    // Afficher les résultats
    function displayResults(query, searchResults, startTime) {
        const resultsContainer = document.getElementById('results');
        const paginationElement = document.getElementById('pagination');
        const timeTakenElement = document.getElementById('timeTaken');
        const loading = document.getElementById('loading');
        
        const queryWords = query.split(/\s+/);
        const allSnippets = searchResults.map(result => result.snippet.toLowerCase());

        // Filtrer les résultats en fonction de la pertinence (PowerRank)
        const results = searchResults.filter(result => calculateTFIDFScore(result, queryWords, allSnippets) > 0);
        results.sort((a, b) => calculatePowerRank(b, queryWords, allSnippets) - calculatePowerRank(a, queryWords, allSnippets));

        const resultsPerPage = 10; // Nombre de résultats par page
        const totalPages = Math.ceil(results.length / resultsPerPage);
        
        function renderPage(page) {
            resultsContainer.innerHTML = ''; // Efface les résultats précédents
            const startIndex = (page - 1) * resultsPerPage;
            const endIndex = startIndex + resultsPerPage;
            const pageResults = results.slice(startIndex, endIndex);

            pageResults.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.classList.add('result');
                resultElement.innerHTML = `
                    <a href="${result.link}" target="_blank">${result.title}</a>
                    <p>${result.snippet}</p>
                    <p><strong>Popularité :</strong> ${result.views || 0} vues</p>
                `;
                resultsContainer.appendChild(resultElement);
            });
        }

        // Gérer la pagination
        function setupPagination() {
            paginationElement.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const pageElement = document.createElement('span');
                pageElement.classList.add('page');
                pageElement.textContent = i;
                pageElement.addEventListener('click', () => {
                    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
                    pageElement.classList.add('active');
                    renderPage(i);
                });
                if (i === 1) pageElement.classList.add('active'); // Activer la première page par défaut
                paginationElement.appendChild(pageElement);
            }
        }

        // Affiche les résultats et la pagination
        renderPage(1); // Afficher la première page de résultats
        setupPagination();

        const endTime = performance.now();
        const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

        loading.style.display = 'none';
        timeTakenElement.textContent = `Les résultats ont été affichés en ${timeTaken} secondes.`;
        timeTakenElement.style.display = 'block';
    }

    document.getElementById('searchForm').addEventListener('submit', search);
};
