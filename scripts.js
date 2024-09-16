// Fonction pour gérer la recherche
function search(event) {
    event.preventDefault();
    const query = document.getElementById('query').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    const timeTakenElement = document.getElementById('timeTaken');
    
    if (!query) return; // Si la requête est vide, on ne fait rien

    loading.style.display = 'block'; // Affiche le message de chargement
    resultsContainer.innerHTML = ''; // Vide les résultats précédents
    const startTime = performance.now(); // Temps de début

    // Charger le fichier JSON
    fetch('sites.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau.');
            }
            return response.json();
        })
        .then(searchResults => {
            // Fonction pour vérifier les correspondances
            function match(text, query) {
                const words = query.split(/\s+/); // Diviser la requête en mots
                return words.every(word => text.includes(word));
            }

            const results = searchResults.filter(result =>
                match(result.title.toLowerCase(), query) ||
                match(result.snippet.toLowerCase(), query)
            );

            // Tri des résultats par pertinence
            results.sort((a, b) => {
                return (b.title.toLowerCase().includes(query) ? 1 : 0) - (a.title.toLowerCase().includes(query) ? 1 : 0) ||
                    (b.snippet.toLowerCase().includes(query) ? 1 : 0) - (a.snippet.toLowerCase().includes(query) ? 1 : 0);
            });

            const endTime = performance.now(); // Temps de fin
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Temps en secondes
            
            loading.style.display = 'none'; // Cache le message de chargement
            
            if (results.length > 0) {
                resultsContainer.innerHTML = ''; // Efface les résultats précédents
                results.forEach(result => {
                    const resultElement = document.createElement('div');
                    resultElement.classList.add('result');
                    resultElement.innerHTML = `
                        <a href="${result.link}" target="_blank">${result.title}</a>
                        <p>${result.snippet}</p>
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
