#!/usr/bin/env bash
# Abre o Cine Vault como janela de app no Chrome/Chromium (mantem o Chromecast)
DIR="$(cd "$(dirname "$0")" && pwd)"
URL="file://$DIR/web/index.html"
for b in google-chrome google-chrome-stable chromium chromium-browser brave-browser microsoft-edge; do
  if command -v "$b" >/dev/null 2>&1; then
    exec "$b" --app="$URL" --autoplay-policy=no-user-gesture-required "$@"
  fi
done
echo "Chrome/Chromium nao encontrado. Abrindo no navegador padrao..."
xdg-open "$URL"
