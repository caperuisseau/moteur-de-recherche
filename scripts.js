<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moteur de Recherche</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <div class="logo">
            <video class="lnXdpd" height="200" width="400" title="logo" id="hplogo" data-csiid="kKuoZs2JBZOrkdUP55GhkAo_3" data-atf="1" loop autoplay muted>
                <source src="newer.mp4" type="video/mp4">
                Votre navigateur ne supporte pas la balise vidéo.
            </video>
        </div>
        <form class="search-form" onsubmit="return search(event)">
            <input type="text" id="query" name="q" placeholder="Recherche" aria-label="Search" required>
            <button type="submit">Recherche</button>
        </form>
        <div id="results">
            <p id="timeTaken" style="display: none;"></p>
        </div>
        <div id="loading" style="display: none;">Loading...</div>
    </div>
    <script src="scripts.js"></script>
</body>
</html>
