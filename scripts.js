// Caching the search results globally to avoid multiple fetch calls
let cachedSearchResults = null;
let documentFrequency = {}; // For storing document frequency for each term

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
        displayResultsWithTfIdf(cachedSearchResults, query, startTime);
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
                calculateDocumentFrequency(searchResults); // Calcul de DF pour chaque terme
                displayResultsWithTfIdf(searchResults, query, startTime);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des résultats :', error);
                loading.style.display = 'none';
                resultsContainer.innerHTML = '<p>Erreur lors du chargement des résultats.</p>';
            });
    }
}

// Fonction pour calculer la fréquence des documents pour chaque terme
function calculateDocumentFrequency(documents) {
    documentFrequency = {}; // Réinitialiser les fréquences des documents
    const totalDocuments = documents.length;

    documents.forEach(document => {
        const words = new Set([...document.title.toLowerCase().split(/\s+/), ...document.snippet.toLowerCase().split(/\s+/)]);
        words.forEach(word => {
            if (!documentFrequency[word]) {
                documentFrequency[word] = 0;
            }
            documentFrequency[word] += 1; // Comptage du nombre de documents contenant ce mot
        });
    });

    // Calcul de l'IDF pour chaque terme
    for (let word in documentFrequency) {
        documentFrequency[word] = Math.log(totalDocuments / documentFrequency[word]);
    }
}

// Fonction pour afficher les résultats avec TF-IDF
function displayResultsWithTfIdf(searchResults, query, startTime) {
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');

    // Fonction pour calculer le score TF-IDF
    function calculateTfIdf(text, query) {
        const words = text.toLowerCase().split(/\s+/);
        const wordCount = {}; // Fréquence des termes dans ce texte
        const totalWords = words.length;
        words.forEach(word => {
            if (!wordCount[word]) {
                wordCount[word] = 0;
            }
            wordCount[word] += 1;
        });

        // Calcul du score TF-IDF pour chaque terme de la requête
        const queryWords = query.split(/\s+/);
        let tfIdfScore = 0;
        queryWords.forEach(queryWord => {
            const tf = wordCount[queryWord] ? wordCount[queryWord] / totalWords : 0; // Term Frequency
            const idf = documentFrequency[queryWord] || 0; // Inverse Document Frequency
            tfIdfScore += tf * idf; // TF-IDF = TF * IDF
        });
        return tfIdfScore;
    }

    // Calcul du TF-IDF pour le titre et le snippet
    const results = searchResults.map(result => {
        const titleTfIdf = calculateTfIdf(result.title, query);
        const snippetTfIdf = calculateTfIdf(result.snippet, query);
        return {
            ...result,
            score: titleTfIdf * 2 + snippetTfIdf // Donner plus de poids au titre
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
