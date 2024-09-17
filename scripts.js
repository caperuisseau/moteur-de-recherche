document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', search);
    } else {
        console.error('Search form not found.');
    }
});

let cachedSearchResults = null;
let invertedIndex = {};

// Search function
function search(event) {
    event.preventDefault();
    const query = document.getElementById('query').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');

    if (!query) {
        resultsContainer.innerHTML = '<p>Veuillez entrer un terme de recherche.</p>';
        return;
    }

    loading.style.display = 'block';
    resultsContainer.innerHTML = '';
    const startTime = performance.now();

    if (cachedSearchResults) {
        displayResults(query, startTime);
    } else {
        fetch('sites.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau.');
                }
                return response.json();
            })
            .then(searchResults => {
                cachedSearchResults = searchResults;
                createInvertedIndex(searchResults);
                displayResults(query, startTime);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des résultats:', error);
                loading.style.display = 'none';
                resultsContainer.innerHTML = '<p>Erreur lors du chargement des résultats.</p>';
            });
    }
}

// Create a simple inverted index
function createInvertedIndex(documents) {
    invertedIndex = {};

    documents.forEach((doc, docIndex) => {
        const words = [...doc.title.toLowerCase().split(/\s+/), ...doc.snippet.toLowerCase().split(/\s+/)];

        words.forEach(word => {
            if (!invertedIndex[word]) {
                invertedIndex[word] = [];
            }
            invertedIndex[word].push(docIndex);
        });
    });
}

// Display results based on query matching
function displayResults(query, startTime) {
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');

    const queryWords = query.split(/\s+/);
    const relevantDocs = {};

    // Exact Phrase Matching (if a phrase is wrapped in quotes)
    const exactPhraseMatch = query.match(/"(.*?)"/);
    const phrase = exactPhraseMatch ? exactPhraseMatch[1].toLowerCase() : null;

    // Boosting logic
    queryWords.forEach(word => {
        if (invertedIndex[word]) {
            invertedIndex[word].forEach(docIndex => {
                if (!relevantDocs[docIndex]) {
                    relevantDocs[docIndex] = { score: 0, titleBoost: false };
                }
                const doc = cachedSearchResults[docIndex];
                if (doc.title.toLowerCase().includes(word)) {
                    relevantDocs[docIndex].score += 2; // Boost title matches
                    relevantDocs[docIndex].titleBoost = true;
                } else if (doc.snippet.toLowerCase().includes(word)) {
                    relevantDocs[docIndex].score += 1; // Standard snippet match
                }
            });
        }
    });

    // Exact phrase matching logic
    if (phrase) {
        cachedSearchResults.forEach((doc, docIndex) => {
            if (doc.title.toLowerCase().includes(phrase) || doc.snippet.toLowerCase().includes(phrase)) {
                if (!relevantDocs[docIndex]) {
                    relevantDocs[docIndex] = { score: 0, titleBoost: false };
                }
                relevantDocs[docIndex].score += 3; // Higher weight for exact phrase match
            }
        });
    }

    // Sort results by score
    const results = Object.keys(relevantDocs)
        .map(docIndex => ({
            ...cachedSearchResults[docIndex],
            score: relevantDocs[docIndex].score,
            titleBoost: relevantDocs[docIndex].titleBoost
        }))
        .sort((a, b) => b.score - a.score); // Sort by relevance score

    const endTime = performance.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    loading.style.display = 'none';

    if (results.length > 0) {
        resultsContainer.innerHTML = '';
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.classList.add('result');
            const highlightTitle = highlightQuery(result.title, query);
            const highlightSnippet = highlightQuery(result.snippet, query);
            const boostLabel = result.titleBoost ? `<span class="boost"> (Title Boosted)</span>` : '';

            resultElement.innerHTML = `
                <a href="${result.link}" target="_blank">${highlightTitle}${boostLabel}</a>
                <p>${highlightSnippet}</p>
            `;
            resultsContainer.appendChild(resultElement);
        });
    } else {
        resultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
    }

    timeTakenElement.textContent = `Les résultats ont été affichés en ${timeTaken} secondes.`;
    timeTakenElement.style.display = 'block';
}

// Function to highlight query terms in the results
function highlightQuery(text, query) {
    const words = query.split(/\s+/);
    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}
