let cachedSearchResults = null;
let invertedIndex = {}; // Inverted index for faster lookup
let documentVectors = {}; // Stores precomputed TF-IDF vectors for each document
let totalDocuments = 0; // To store the total number of documents

// Wait for the DOM to fully load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchForm').addEventListener('submit', search);
});

// Function to handle search
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

    // If cached results are available, use them
    if (cachedSearchResults) {
        displayResultsWithCosineSimilarity(query, startTime);
    } else {
        // Load the JSON file
        fetch('sites.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau.');
                }
                return response.json();
            })
            .then(searchResults => {
                cachedSearchResults = searchResults; // Cache the results
                totalDocuments = searchResults.length;
                createInvertedIndexAndPrecomputeTfIdf(searchResults); // Precompute TF-IDF
                displayResultsWithCosineSimilarity(query, startTime);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des résultats :', error);
                loading.style.display = 'none';
                resultsContainer.innerHTML = '<p>Erreur lors du chargement des résultats.</p>';
            });
    }
}

// Function to create the inverted index and precompute TF-IDF for each document
function createInvertedIndexAndPrecomputeTfIdf(documents) {
    documentVectors = {}; // Reset document vectors
    invertedIndex = {}; // Reset inverted index

    // Calculate TF-IDF for each document and build the inverted index
    documents.forEach((doc, docIndex) => {
        const words = [...doc.title.toLowerCase().split(/\s+/), ...doc.snippet.toLowerCase().split(/\s+/)];
        const wordCount = {};

        words.forEach(word => {
            if (!wordCount[word]) {
                wordCount[word] = 0;
            }
            wordCount[word] += 1;
        });

        // Create the TF-IDF vector for this document
        const tfIdfVector = {};
        Object.keys(wordCount).forEach(word => {
            const tf = wordCount[word] / words.length;
            const idf = invertedIndex[word] ? invertedIndex[word].idf : Math.log(totalDocuments / (1 + 1)); // Smoothed IDF
            const tfIdf = tf * idf;

            tfIdfVector[word] = tfIdf;

            // Add to inverted index
            if (!invertedIndex[word]) {
                invertedIndex[word] = {
                    documents: [],
                    idf: 0
                };
            }
            invertedIndex[word].documents.push({ docIndex, tfIdf });
        });

        // Store the TF-IDF vector
        documentVectors[docIndex] = tfIdfVector;
    });

    // Update IDF in the inverted index
    Object.keys(invertedIndex).forEach(word => {
        const docCount = invertedIndex[word].documents.length;
        invertedIndex[word].idf = Math.log(totalDocuments / docCount);
    });
}

// Function to display results with cosine similarity
function displayResultsWithCosineSimilarity(query, startTime) {
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');

    const queryWords = query.split(/\s+/);
    const queryVector = createQueryVector(queryWords);

    // Calculate cosine similarity for each document
    const results = Object.keys(documentVectors).map(docIndex => {
        const docVector = documentVectors[docIndex];
        const cosineSim = calculateCosineSimilarity(queryVector, docVector);
        return {
            ...cachedSearchResults[docIndex],
            score: cosineSim
        };
    }).filter(result => result.score > 0); // Keep relevant results

    // Sort results by descending score
    results.sort((a, b) => b.score - a.score);

    const endTime = performance.now(); // End time
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Time in seconds

    loading.style.display = 'none'; // Hide loading message

    if (results.length > 0) {
        resultsContainer.innerHTML = ''; // Clear previous results
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

// Function to create a query TF-IDF vector
function createQueryVector(queryWords) {
    const queryVector = {};
    queryWords.forEach(word => {
        const idf = invertedIndex[word] ? invertedIndex[word].idf : Math.log(totalDocuments / 1); // Smoothed IDF
        queryVector[word] = idf; // Assuming term frequency is 1 for query words
    });
    return queryVector;
}

// Function to calculate cosine similarity
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

// Function to highlight query terms in results
function highlightQuery(text, query) {
    const words = query.split(/\s+/);
    const regex = new RegExp(`(${words.join('|')})`, 'gi'); // Create a regex with query terms
    return text.replace(regex, '<mark>$1</mark>'); // Highlight matching terms
}
