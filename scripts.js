const searchResults = [
    {
        "title": "Apprendre le JavaScript",
        "snippet": "JavaScript est un langage de programmation utilisé pour créer des pages web interactives.",
        "link": "https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide"
    },
    {
        "title": "newer paint",
        "snippet": "alors franchement il est beau et fait maison alors si vous aimez newer browser vous allez aimer newer paint",
        "link": "paint/index.html"
    },
    {
        "title": "newer browser v1 reload",
        "snippet": "j'ai remis la première versions pour la nostalgie mais il y a beaucoup moin de site",
        "link": "browser/index.html"
    },
    {
        "title": "Renault megane rs",
        "snippet": " une putain de voiture demander par un con",
        "link": "https://www.renault.fr/vehicules-gammes-precedentes/megane-rs-ultime.html"
    },
    { 
        "title": "minecrafttools",
        "snippet": "des choses utile a faire sur minecraft",
        "link": "https://minecraft.tools"
    },
    {
        "title": "krea ai",
        "snippet": "une ia qui génère des vidéo des photo caché et des photo",
        "link": "https://krea.ai"
    },
    {
        "title": "aternos",
        "snippet": "un hébergeur de serveur minecraft gratuit pour toujours",
        "link": "https://aternos.org"
    },
    {
        "title": "wikihow",
        "snippet": "un wiki pour savoir comment faire (utile)",
        "link": "https://wikihow.com"
    },
    {
        "title": "france wikipedia",
        "snippet": "la page wikipedia de la france",
        "link": "https://wikipedia.org/wiki/France"
    },
    {
        "title": "paris wikipedia",
        "snippet": "le wikipedia de paris",
        "link": "https://wikipedia.org/wiki/Paris"
    },
    {
        "title": "marseille wikipedia",
        "snippet": "le wikipedia de marseille",
        "link": "https://wikipedia.org/wiki/Marseille"
    },
    {
        "title": "wikipédia",
        "snippet": "c'est the wiki",
        "link": "https://wikipedia.org"
    },
    {
        "title": "larousse",
        "snippet": "un dictionnaire de mots français",
        "link": "https://Larousse.fr"
    },
    {
        "title": "gmail",
        "snippet": "une boite mail par google",
        "link": "https://mail.google.com"
    },
    {
        "title": "ROBLOX",
        "snippet": "jeu qui est bien mais sa commu fais que tout le monde déteste ce jeu(mais le jeu est bien)",
        "link": "https://roblox.com"
    },
    {
        "title": "kour",
        "snippet": "je de tir en ligne avec plusieurs mode de jeu",
        "link": "https://kour.io"
    },
    {
        "title": "opera",
        "snippet": "un autre moteur de recherche mais n'y allez pas celui là est meilleur",
        "link": "https://opera.com"
    },
    {
        "title": "yahoo",
        "snippet": "un autre moteur de recherche mais n'y aller pas car celui là est meilleur",
        "link": "https://yahoo.com"
    },
    {
        "title": "netflix",
        "snippet": "une app de streaming vidéo",
        "link": "https://www.netflix.com"
    },
    {
        "title": "google",
        "snippet": "un autre moteur de recherche mais n'y allez pas car celui là est meilleur",
        "link": "https://www.google.com"
    },
    {
        "title": "bing",
        "snippet": "un autre moteur de recherche mais n'y allez pas car celui là est meilleur",
        "link": "https://www.bing.com"
    },
    {
        "title": "bitsy",
        "snippet": "une plateforme de création de jeu en html",
        "link": "https://bitsy.org"
    },
    {
        "title": "netlify",
        "snippet": "netlify un hébergeur de site web gratuit github",
        "link": "https://www.netlify.com"
    },
    {
        "title": "Tutoriel HTML",
        "snippet": "HTML est le langage standard pour créer des pages Web.",
        "link": "https://www.w3schools.com/html/"
    },
    {
        "title": "Guide CSS",
        "snippet": "CSS est un langage de style utilisé pour décrire la présentation d'un document écrit en HTML ou XML.",
        "link": "https://developer.mozilla.org/fr/docs/Web/CSS"
    },
    {
        "title": "Python pour les débutants",
        "snippet": "Python est un langage de programmation interprété, interactif et orienté objet.",
        "link": "https://www.python.org/about/gettingstarted/"
    },
    {
        "title": "itch io",
        "snippet": "itch io est une plateforme de jeu un dé",
        "link": "https://itch.io"
    },
    {
        "title": "poki",
        "snippet": "poki est une plate forme de jeu en ligne",
        "link": "https://poki.com"
    },
    {
        "title": "Introduction à Java",
        "snippet": "Java est un langage de programmation et une plateforme informatique.",
        "link": "https://www.oracle.com/java/technologies/javase-downloads.html"
    },
    {
        "title": "notepad++",
        "snippet": "notepad est un IDLE pour tout language de code possible",
        "link": "https://notepad-plus-plus.org"
    },
    {
        "title": "Minecraft",
        "snippet": "Minecraft est le jeu le plus vendu de tous les temps, classé 7+.",
        "link": "https://www.minecraft.net"
    },
    {
        "title": "newer browser",
        "snippet": "le nouveau browser vous êtes dessus là enfaite",
        "link": "https://caperuisseau.itch.io/c-browser"
    },
    {
        "title": "Fortnite Battle Royale",
        "snippet": "Fortnite est le battle royale le plus téléchargé de tous les temps, classé 12+.",
        "link": "https://www.fortnite.com"
    },
    {
        "title": "Bases de données SQL",
        "snippet": "SQL est un langage de programmation utilisé pour gérer et manipuler des bases de données relationnelles.",
        "link": "https://www.w3schools.com/sql/"
    },
    {
        "title": "C++ Tutoriel",
        "snippet": "C++ est un langage de programmation à usage général qui est couramment utilisé pour développer des applications système et des logiciels de jeu.",
        "link": "https://www.learncpp.com/"
    },
    {
        "title": "Introduction à l'Intelligence Artificielle",
        "snippet": "L'intelligence artificielle est un domaine de l'informatique qui met l'accent sur la création de machines intelligentes qui travaillent et réagissent comme des humains.",
        "link": "https://www.ibm.com/cloud/learn/what-is-artificial-intelligence"
    },
    {
        "title": "Développement Web avec React",
        "snippet": "React est une bibliothèque JavaScript pour la construction d'interfaces utilisateur.",
        "link": "https://reactjs.org/"
    },
    {
        "title": "ChatGPT",
        "snippet": "une IA machine learning crée par openAI",
        "link": "https://chat.openai.com"
    },
    {
        "title": "openai",
        "snippet": " entreprise révolutionnaire qui a crée chatGPT un IA",
        "link": "https://openai.com"
    },
    {
        "title": "Tutoriel Git",
        "snippet": "Git est un système de contrôle de version distribué gratuit et open source conçu pour gérer tout, des petits aux très grands projets avec rapidité et efficacité.",
        "link": "https://git-scm.com/doc"
    },
    {
        "title": "Fortnite Lego",
        "snippet": "une belle collaboration entre fortnite et lego et en ce moment il y a Fortnite + Lego + Star Wars",
        "link": "https://www.fortnite.com/news/star-wars-lands-in-the-fortnite-universe-the-eve-of-star-wars-day"
    },
    {
        "title": "Introduction à Docker",
        "snippet": "Docker est une plateforme ouverte pour développer, expédier et exécuter des applications.",
        "link": "https://docs.docker.com/get-started/"
    },
    {
        "title": "Node.js Guide",
        "snippet": "Node.js est un environnement d'exécution JavaScript côté serveur.",
        "link": "https://nodejs.org/en/docs/"
    },
    {
        "title": "Tutoriel Vue.js",
        "snippet": "Vue.js est un framework JavaScript progressif utilisé pour construire des interfaces utilisateur.",
        "link": "https://vuejs.org/v2/guide/"
    },
    {
        "title": "squeezie youtube",
        "snippet": " le youtubeur le plus connu de france avec 18,9 millions d'abonnés",
        "link": "https://www.youtube.com/user/aMOODIEsqueezie"
    },
    {
        "title": "pipi",
        "snippet": "vous êtes pas mature.",
        "link": "https://www.instantspresents.com/15-conseils-pour-etre-plus-mature-et-responsable/#:~:text=15%20conseils%20pour%20%C3%AAtre%20plus%20mature%20et%20responsable,...%208%20Soyez%20ouvert%20d%E2%80%99esprit%20plus%20souvent.%20"
    },
    {
        "title": "historique de Epic Games",
        "snippet": "historique de epic games",
        "link": "https://en.wikipedia.org/wiki/Epic_Games"
    }
];

function search(event) {
    event.preventDefault();
    const query = document.getElementById('query').value.toLowerCase();
    const resultsContainer = document.getElementById('results');
    const loading = document.getElementById('loading');
    resultsContainer.innerHTML = '';
    loading.style.display = 'block';

    setTimeout(() => {
        const results = searchResults.filter(result => 
            result.title.toLowerCase().includes(query) || 
            result.snippet.toLowerCase().includes(query)
        );
        loading.style.display = 'none';

        if (results.length > 0) {
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
            resultsContainer.innerHTML = '<p>No results found.</p>';
        }
    }, 500);
}
