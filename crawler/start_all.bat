@echo off 
"to real.py"
python sites.py
python "remove doublons.py"
echo TERMINE!
pause
echo debarassage des fichier maintenant inutile!
pause
del "crawler_results.db"
del "sites.json"
echo fichier inutile debarrase!
pause