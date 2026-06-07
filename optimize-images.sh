#!/usr/bin/env bash
# optimize-images.sh — konverze fotek do formátu WebP
#
# Požadavky: balíček `webp` (příkaz cwebp)
#   Ubuntu/Debian:  sudo apt install webp
#   macOS (Homebrew): brew install webp
#
# Použití:
#   chmod +x optimize-images.sh
#   ./optimize-images.sh
#
# Skript prochází složku images/, hledá .jpg/.jpeg/.png soubory
# a pro každý vytvoří .webp verzi (pokud ještě neexistuje).
# Originální soubory NEJSOU smazány.

set -euo pipefail

QUALITY=82        # 0–100 (82 je dobrý kompromis kvality a velikosti)
INPUT_DIR="images"

if ! command -v cwebp &>/dev/null; then
  echo "CHYBA: příkaz 'cwebp' nenalezen."
  echo "Nainstalujte balíček 'webp':"
  echo "  Ubuntu/Debian: sudo apt install webp"
  echo "  macOS:         brew install webp"
  exit 1
fi

echo "Hledám obrázky ve složce: ${INPUT_DIR}/"
count=0
skipped=0

while IFS= read -r -d '' src; do
  webp="${src%.*}.webp"
  if [[ -f "$webp" ]]; then
    echo "  přeskočeno (WebP již existuje): ${webp}"
    ((skipped++)) || true
    continue
  fi
  echo "  konvertuji: ${src} → ${webp}"
  cwebp -quiet -q "$QUALITY" "$src" -o "$webp"
  ((count++)) || true
done < <(find "$INPUT_DIR" \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -print0)

echo ""
echo "Hotovo. Konvertováno: ${count}, přeskočeno: ${skipped}."
