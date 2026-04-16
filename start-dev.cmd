@echo off
setlocal

cd /d "%~dp0"

echo [MedFlow] Preparando ambiente...
call node scripts\inject-env.js
if errorlevel 1 (
  echo [MedFlow] Falha ao gerar variaveis de ambiente.
  exit /b %errorlevel%
)

echo [MedFlow] Abrindo backend em uma janela...
start "MedFlow API" cmd /k "cd /d %~dp0 && set NODE_ENV=development && call node_modules\.bin\tsx.cmd watch server\_core\index.ts"

echo [MedFlow] Abrindo Expo em outra janela...
start "MedFlow Expo" cmd /k "cd /d %~dp0 && set EXPO_USE_METRO_WORKSPACE_ROOT=1 && set EXPO_PORT=11000 && call node_modules\.bin\expo.cmd start --port 11000"

echo [MedFlow] Pronto. Mantenha as duas janelas abertas durante os testes.
