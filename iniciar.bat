@echo off
cd /d "%~dp0"

echo Iniciando backend (porta 3001)...
start "Igreja - Backend" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo Iniciando frontend (porta 5173)...
start "Igreja - Frontend" cmd /k "cd client && npm run dev"

timeout /t 3 /nobreak >nul

echo Abrindo o site no navegador...
start http://localhost:5173

echo.
echo Pronto! Duas janelas de terminal foram abertas (backend e frontend).
echo NAO FECHE essas janelas enquanto estiver usando o sistema.
echo Para parar, feche as duas janelas ou aperte Ctrl+C em cada uma.
pause
