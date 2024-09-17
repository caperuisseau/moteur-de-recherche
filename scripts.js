let cachedSearchResults = null;
let invertedIndex = {}; // Inverted index for faster lookup
let documentVectors = {}; // Stores precomputed TF-IDF vectors for each document
let totalDocuments = 0; // To store the total number of documents

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
        displayResultsWithCosineSimilarity(query, startTime);
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
                totalDocuments = searchResults.length;
                createInvertedIndexAndPrecomputeTfIdf(searchResults); // Pré-calcul des TF-IDF
                displayResultsWithCosineSimilarity(query, startTime);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des résultats :', error);
                loading.style.display = 'none';
                resultsContainer.innerHTML = '<p>Erreur lors du chargement des résultats.</p>';
            });
    }
}

// Fonction pour créer l'index inversé et pré-calculer TF-IDF pour chaque document
function createInvertedIndexAndPrecomputeTfIdf(documents) {
    documentVectors = {}; // Réinitialiser les vecteurs de documents
    invertedIndex = {}; // Réinitialiser l'index inversé

    // Calcul de TF-IDF pour chaque document et construction de l'index inversé
    documents.forEach((doc, docIndex) => {
        const words = [...doc.title.toLowerCase().split(/\s+/), ...doc.snippet.toLowerCase().split(/\s+/)];
        const wordCount = {};
        words.forEach(word => {
            if (!wordCount[word]) {
                wordCount[word] = 0;
            }
            wordCount[word] += 1;
        });

        // Créer le vecteur TF-IDF pour ce document
        const tfIdfVector = {};
        Object.keys(wordCount).forEach(word => {
            const tf = wordCount[word] / words.length;
            const idf = invertedIndex[word] ? invertedIndex[word].idf : Math.log(totalDocuments / (1 + 1)); // Smoothed IDF
            const tfIdf = tf * idf;

            tfIdfVector[word] = tfIdf;

            // Ajouter à l'index inversé
            if (!invertedIndex[word]) {
                invertedIndex[word] = {
                    documents: [],
                    idf: 0
                };
            }
            invertedIndex[word].documents.push({ docIndex, tfIdf });
        });

        // Stocker le vecteur TF-IDF
        documentVectors[docIndex] = tfIdfVector;
    });

    // Mise à jour de l'IDF dans l'index inversé
    Object.keys(invertedIndex).forEach(word => {
        const docCount = invertedIndex[word].documents.length;
        invertedIndex[word].idf = Math.log(totalDocuments / docCount);
    });
}

// Fonction pour afficher les résultats avec la similarité cosinus
function displayResultsWithCosineSimilarity(query, startTime) {
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');

    const queryWords = query.split(/\s+/);
    const queryVector = createQueryVector(queryWords);

    // Calculer la similarité cosinus pour chaque document
    const results = Object.keys(documentVectors).map(docIndex => {
        const docVector = documentVectors[docIndex];
        const cosineSim = calculateCosineSimilarity(queryVector, docVector);
        return {
            ...cachedSearchResults[docIndex],
            score: cosineSim
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

// Fonction pour créer un vecteur de requête TF-IDF
function createQueryVector(queryWords) {
    const queryVector = {};
    queryWords.forEach(word => {
        const idf = invertedIndex[word] ? invertedIndex[word].idf : Math.log(totalDocuments / 1); // Smoothed IDF
        queryVector[word] = idf; // Assuming term frequency is 1 for query words
    });
    return queryVector;
}

// Fonction pour calculer la similarité cosinus
function calculateCosineSimilarity(queryVector, docVector) {
    let dotProduct = 0;
    let queryMagnitude = 0;
    let docMagnitude = 0;

    Object.keys(queryVector).forEach(word => {
        dotProduct += (queryVector[word] || 0) * (docVector[word] || 0);
        queryMagnitude += Math.pow(queryVector[word] || 0, 2);
        docMagnitude += Math.pow(docVector[word] || 0, 2);
    });

    queryMagnitude = Math.sqrt(queryMagnitude);
    docMagnitude = Math.sqrt(docMagnitude);

    if (queryMagnitude === 0 || docMagnitude === 0) {
        return 0;
    }

    return dotProduct / (queryMagnitude * docMagnitude);
}

// Fonction pour surligner les termes de recherche dans les résultats
function highlightQuery(text, query) {
    const words = query.split(/\s+/);
    const regex = new RegExp(`(${words.join('|')})`, 'gi'); // Créer une regex avec les termes de recherche
    return text.replace(regex, '<mark>$1</mark>'); // Surligner les termes correspondants
}

document.getElementById('searchForm').addEventListener('submit', search);
