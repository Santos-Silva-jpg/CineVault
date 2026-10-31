#!/usr/bin/env bash
# Cria um atalho no menu de aplicativos apontando para abrir.sh
DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p ~/.local/share/applications
cat > ~/.local/share/applications/cinevault.desktop <<EOF
[Desktop Entry]
Type=Application
Name=Cine Vault
Comment=Filmes por genero com trilha de fundo
Exec=$DIR/abrir.sh
Icon=$DIR/web/assets/logo.jpg
Categories=AudioVideo;Video;
Terminal=false
EOF
echo "Atalho criado: procure por 'Cine Vault' no menu de aplicativos."
