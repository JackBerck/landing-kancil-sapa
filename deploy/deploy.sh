#!/usr/bin/env bash
# Deploy situs statis ke VPS: build lokal, unggah ke folder rilis baru, lalu pindahkan symlink `current`.
# Pemakaian:  VPS=user@ip.vps ./deploy/deploy.sh
set -euo pipefail

: "${VPS:?Isi VPS=user@host}"
REMOTE_ROOT="${REMOTE_ROOT:-/var/www/kancilsapa.com}"
RELEASE="$(date +%Y%m%d%H%M%S)"

cd "$(dirname "$0")/.."
pnpm install --frozen-lockfile
pnpm build

ssh "$VPS" "mkdir -p $REMOTE_ROOT/releases/$RELEASE"
rsync -az --delete build/ "$VPS:$REMOTE_ROOT/releases/$RELEASE/"
ssh "$VPS" "ln -sfn $REMOTE_ROOT/releases/$RELEASE $REMOTE_ROOT/current && ls -1dt $REMOTE_ROOT/releases/* | tail -n +6 | xargs -r rm -rf"

echo "Terpasang: $RELEASE"
