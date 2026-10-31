#!/usr/bin/env bash
# Gera o executavel Linux (AppImage + .deb) na pasta dist/
set -e
cd "$(dirname "$0")"
command -v npm >/dev/null || { echo "Instale o Node.js/npm primeiro (ex.: sudo apt install nodejs npm)"; exit 1; }
npm install
npm run build
echo
echo "Pronto! Veja a pasta dist/ :"
ls -1 dist | grep -E 'AppImage|deb' || true
echo "Para rodar o AppImage:  chmod +x dist/*.AppImage && ./dist/*.AppImage"
