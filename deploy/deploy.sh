#!/usr/bin/env bash
# Upload a local source release using an ordinary SSH account with Docker access.
set -euo pipefail

if [[ $# != 2 ]]; then
  echo "Usage: $0 USER@HOST /absolute/portfolio/path" >&2
  echo "Optional: PORTFOLIO_PORT=8080 PORTFOLIO_BIND=127.0.0.1 VITE_BASE_PATH=/ COMPOSE_PROJECT_NAME=arnav-portfolio" >&2
  exit 2
fi

target=$1
remote_root=${2%/}
bind=${PORTFOLIO_BIND:-127.0.0.1}
port=${PORTFOLIO_PORT:-8080}
project=${COMPOSE_PROJECT_NAME:-arnav-portfolio}
base=${VITE_BASE_PATH:-/}

[[ $target =~ ^[A-Za-z0-9][A-Za-z0-9_.@:-]*$ ]] || { echo "Invalid SSH target." >&2; exit 2; }
[[ $remote_root =~ ^/[A-Za-z0-9_./-]+$ && $remote_root != / ]] || { echo "Use an absolute deployment directory without spaces." >&2; exit 2; }
[[ /$remote_root/ != *'/../'* && /$remote_root/ != *'/./'* ]] || { echo "Deployment directory must not contain dot components." >&2; exit 2; }
[[ $bind == 127.0.0.1 || $bind == 0.0.0.0 ]] || { echo "PORTFOLIO_BIND must be 127.0.0.1 or 0.0.0.0." >&2; exit 2; }
if [[ ! $port =~ ^[0-9]{1,5}$ ]]; then
  echo "Invalid port." >&2
  exit 2
fi
if ((10#$port <= 0 || 10#$port >= 65536)); then
  echo "Invalid port." >&2
  exit 2
fi
[[ $project =~ ^[a-z0-9][a-z0-9_-]*$ ]] || { echo "Invalid Compose project name." >&2; exit 2; }
[[ $base =~ ^/([A-Za-z0-9_-]+/)*$ ]] || { echo "Use a base path with leading and trailing slashes, e.g. /portfolio/." >&2; exit 2; }

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
release="$remote_root/releases/$(date -u +%Y%m%dT%H%M%SZ)-$$"
archive=$(mktemp "${TMPDIR:-/tmp}/portfolio-release.XXXXXX")
trap 'rm -f "$archive"' EXIT

cd "$repo_root"
files=(Dockerfile .dockerignore nginx.conf compose.yaml package.json package-lock.json index.html vite.config.ts tsconfig*.json src public)
COPYFILE_DISABLE=1 tar -czf "$archive" "${files[@]}"
ssh_options=(-o BatchMode=yes -o ConnectTimeout=15 -o ServerAliveInterval=15 -o ServerAliveCountMax=2)
# Variables intentionally expand locally after the restrictive validation above.
# shellcheck disable=SC2029
ssh "${ssh_options[@]}" "$target" "mkdir -p '$remote_root/releases' && mkdir '$release' && tar -xzf - -C '$release'" < "$archive"

# shellcheck disable=SC2029
ssh "${ssh_options[@]}" "$target" "bash -s -- '$release' '$bind' '$port' '$project' '$base'" <<'REMOTE'
set -euo pipefail
release=$1
export PORTFOLIO_BIND=$2 PORTFOLIO_PORT=$3 COMPOSE_PROJECT_NAME=$4
export VITE_BASE_PATH=$5
export PORTFOLIO_IMAGE="$COMPOSE_PROJECT_NAME:$(basename "$release")"
cd "$release"
docker compose config --quiet
docker compose build
docker compose up --detach --wait --wait-timeout 90
curl --fail --silent --show-error "http://127.0.0.1:$PORTFOLIO_PORT/healthz"
printf '\nDeployed release: %s\n' "$release"
REMOTE
