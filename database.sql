-- database.sql

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS search_db;

-- Utilisation de la base de données
USE search_db;

-- Création de la table
CREATE TABLE IF NOT EXISTS search_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    snippet TEXT NOT NULL,
    link VARCHAR(255) NOT NULL
);

-- Insérer les données de test
INSERT INTO search_results (title, snippet, link) VALUES
('Apprendre le JavaScript', 'JavaScript est un langage de programmation utilisé pour créer des pages web interactives.', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide'),
('newer paint', 'alors franchement il est beau et fait maison alors si vous aimez newer browser vous allez aimer newer paint', 'https://newer-browser.netlify.app/paint/index.html'),
('newer texte', 'c\'est beau c\'est utile c\'est bien fait c\'est newer c\'est cool!', 'https://newer-text.netlify.app/'),
('newer browser v1 reload', 'j\'ai remis la première versions pour la nostalgie mais il y a beaucoup moin de site', 'https://newer-browser.netlify.app/browser/index.html'),
('Renault megane rs', ' une putain de voiture demander par un con', 'https://www.renault.fr/vehicules-gammes-precedentes/megane-rs-ultime.html'),
('minecrafttools', 'des choses utile a faire sur minecraft', 'https://minecraft.tools'),
('krea ai', 'une ia qui génère des vidéo des photo caché et des photo', 'https://krea.ai'),
('aternos', 'un hébergeur de serveur minecraft gratuit pour toujours', 'https://aternos.org'),
('wikihow', 'un wiki pour savoir comment faire (utile)', 'https://wikihow.com'),
('france wikipedia', 'la page wikipedia de la france', 'https://wikipedia.org/wiki/France'),
('paris wikipedia', 'le wikipedia de paris', 'https://wikipedia.org/wiki/Paris'),
('marseille wikipedia', 'le wikipedia de marseille', 'https://wikipedia.org/wiki/Marseille'),
('wikipédia', 'c\'est the wiki', 'https://wikipedia.org'),
('larousse', 'un dictionnaire de mots français', 'https://Larousse.fr'),
('gmail', 'une boite mail par google', 'https://mail.google.com'),
('ROBLOX', 'jeu qui est bien mais sa commu fais que tout le monde déteste ce jeu(mais le jeu est bien)', 'https://roblox.com'),
('kour', 'je de tir en ligne avec plusieurs mode de jeu', 'https://kour.io'),
('opera', 'un autre moteur de recherche mais n\'y allez pas celui là est meilleur', 'https://opera.com'),
('yahoo', 'un autre moteur de recherche mais n\'y aller pas car celui là est meilleur', 'https://yahoo.com'),
('netflix', 'une app de streaming vidéo', 'https://www.netflix.com'),
('google', 'un autre moteur de recherche mais n\'y allez pas car celui là est meilleur', 'https://www.google.com'),
('bing', 'un autre moteur de recherche mais n\'y allez pas car celui là est meilleur', 'https://www.bing.com'),
('bitsy', 'une plateforme de création de jeu en html', 'https://bitsy.org'),
('netlify', 'netlify un hébergeur de site web gratuit github', 'https://www.netlify.com'),
('Tutoriel HTML', 'HTML est le langage standard pour créer des pages Web.', 'https://www.w3schools.com/html/'),
('Guide CSS', 'CSS est un langage de style utilisé pour décrire la présentation d\'un document écrit en HTML ou XML.', 'https://developer.mozilla.org/fr/docs/Web/CSS'),
('Python pour les débutants', 'Python est un langage de programmation interprété, interactif et orienté objet.', 'https://www.python.org/about/gettingstarted/'),
('itch io', 'itch io est une plateforme de jeu un dé', 'https://itch.io'),
('poki', 'poki est une plate forme de jeu en ligne', 'https://poki.com'),
('Introduction à Java', 'Java est un langage de programmation et une plateforme informatique.', 'https://www.oracle.com/java/technologies/javase-downloads.html'),
('notepad++', 'notepad est un IDLE pour tout language de code possible', 'https://notepad-plus-plus.org'),
('Minecraft', 'Minecraft est le jeu le plus vendu de tous les temps, classé 7+.','https://www.minecraft.net'),
('newer browser', 'le nouveau browser vous êtes dessus là enfaite', 'https://caperuisseau.itch.io/c-browser'),
('Fortnite Battle Royale', 'Fortnite est le battle royale le plus téléchargé de tous les temps, classé 12+.','https://www.fortnite.com'),
('Bases de données SQL', 'SQL est un langage de programmation utilisé pour gérer et manipuler des bases de données relationnelles.', 'https://www.w3schools.com/sql/'),
('C++ Tutoriel', 'C++ est un langage de programmation à usage général qui est couramment utilisé pour développer des applications système et des logiciels de jeu.', 'https://www.learncpp.com/'),
('Introduction à l\'Intelligence Artificielle', 'L\'intelligence artificielle est un domaine de l\'informatique qui met l\'accent sur la création de machines intelligentes qui travaillent et réagissent comme des humains.', 'https://www.ibm.com/cloud/learn/what-is-artificial-intelligence'),
('Développement Web avec React', 'React est une bibliothèque JavaScript pour la construction d\'interfaces utilisateur.', 'https://reactjs.org/'),
('ChatGPT', 'une IA machine learning crée par openAI', 'https://chat.openai.com'),
('openai', ' entreprise révolutionnaire qui a crée chatGPT un IA', 'https://openai.com'),
('Tutoriel Git', 'Git est un système de contrôle de version distribué gratuit et open source conçu pour gérer tout, des petits aux très grands projets avec rapidité et efficacité.', 'https://git-scm.com/doc'),
('Fortnite Lego', 'une belle collaboration entre fortnite et lego et en ce moment il y a Fortnite + Lego + Star Wars', 'https://www.fortnite.com/news/star-wars-lands-in-the-fortnite-universe-the-eve-of-star-wars-day'),
('Introduction à Docker', 'Docker est une plateforme ouverte pour développer, expédier et exécuter des applications.', 'https://docs.docker.com/get-started/'),
('Node.js Guide', 'Node.js est un environnement d\'exécution JavaScript côté serveur.', 'https://nodejs.org/en/docs/'),
('Tutoriel Vue.js', 'Vue.js est un framework JavaScript progressif utilisé pour construire des interfaces utilisateur.', 'https://vuejs.org/v2/guide/'),
('squeezie youtube', ' le youtubeur le plus connu de france avec 18,9 millions d\'abonnés', 'https://www.youtube.com/user/aMOODIEsqueezie'),
('pipi', 'vous êtes pas mature.', 'https://www.instantspresents.com/15-conseils-pour-etre-plus-mature-et-responsable/#:~:text=15%20conseils%20pour%20%C3%AAtre%20plus%20mature%20et%20responsable,...%208%20Soyez%20ouvert%20d%E2%80%99esprit%20plus%20souvent.%20'),
('historique de Epic Games', 'historique de epic games', 'https://en.wikipedia.org/wiki/Epic_Games');
