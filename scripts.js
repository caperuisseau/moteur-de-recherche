// script.js

function search(event) {
    event.preventDefault();
    const query = document.getElementById('query').value;
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    resultsContainer.innerHTML = '';
    loading.style.display = 'block';

    fetch(`/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            if (data.length > 0) {
                data.forEach(result => {
                    const resultElement = document.createElement('div');
                    resultElement.classList.add('result');
                    resultElement.innerHTML = `
                        <a href="${result.link}" target="_blank">${result.title}</a>
                        <p>${result.snippet}</p>
                    `;
                    resultsContainer.appendChild(resultElement);
                });
            } else {
                resultsContainer.innerHTML = '<p>No results found.</p>';
            }
        })
        .catch(error => {
            loading.style.display = 'none';
            resultsContainer.innerHTML = '<p>Error occurred.</p>';
        });
}
