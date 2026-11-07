@echo off
rem Prepare le site pour la mise en ligne : inscrit les informations de
rem config\infos-vps.ini dans les pages, regle l'indexation et l'adresse du site.
rem Outil FACULTATIF (Python 3) : au quotidien, le site lit lui-meme le fichier.
chcp 65001 >nul
cd /d "%~dp0.."
set "PYTHON="
where py >nul 2>nul && set "PYTHON=py"
if not defined PYTHON (
  for /f "delims=" %%P in ('where python 2^>nul ^| findstr /v /i "WindowsApps"') do if not defined PYTHON set "PYTHON=%%P"
)
if not defined PYTHON goto sanspython
"%PYTHON%" outils\preparer_publication.py
goto fin

:sanspython
echo.
echo  Python n'est pas installe sur cet ordinateur.
echo.
echo  Ce n'est pas genant : les informations de config\infos-vps.ini
echo  s'affichent deja sur le site. Enregistrez le fichier, puis
echo  actualisez la page dans le navigateur (touche F5).
echo.
echo  Cet outil sert seulement avant la mise en ligne, pour inscrire ces
echo  informations dans les pages et autoriser le referencement
echo  (voir README.md, section 9).
:fin
echo.
pause
