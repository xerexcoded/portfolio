#!/usr/bin/env bash
# Installed by NixOS as /etc/portfolio/deploy on Xenix.
# The deploy account owns PORTFOLIO_REPO and must have access to Docker.
set -euo pipefail

if [[ -n ${SSH_ORIGINAL_COMMAND:-} ]]; then
  [[ $SSH_ORIGINAL_COMMAND =~ ^deploy-portfolio\ ([0-9a-f]{40})$ ]] || { echo "Only deploy-portfolio COMMIT_SHA is allowed." >&2; exit 2; }
  revision=${BASH_REMATCH[1]}
elif [[ $# == 1 && $1 =~ ^[0-9a-f]{40}$ ]]; then
  revision=$1
else
  echo "Usage: deploy-portfolio COMMIT_SHA" >&2
  exit 2
fi

repo=${PORTFOLIO_REPO:-/srv/portfolio/repository}
env_file=${PORTFOLIO_ENV_FILE:-/etc/portfolio.env}
[[ -d $repo/.git ]] || { echo "The portfolio repository must be provisioned first." >&2; exit 1; }
[[ -f $env_file ]] || { echo "The portfolio Compose environment file must be provisioned first." >&2; exit 1; }

exec 9>"$repo/.git/portfolio-deploy.lock"
flock -n 9 || { echo "Another portfolio deployment is running." >&2; exit 1; }
cd "$repo"
git fetch --prune origin main
git cat-file -e "$revision^{commit}"
git merge-base --is-ancestor "$revision" origin/main || { echo "Commit is not on origin/main." >&2; exit 1; }
if [[ $revision != $(git rev-parse origin/main) ]]; then
  echo "The requested revision is stale; deploy the current main tip." >&2
  exit 1
fi
if [[ -n $(git status --porcelain) ]]; then
  echo "Deployment checkout has local changes; leaving them intact." >&2
  exit 1
fi
previous_revision=$(git rev-parse HEAD)
compose=(docker compose --env-file "$env_file" --project-name arnav-portfolio)
previous_container=$("${compose[@]}" ps --all --quiet portfolio)
previous_image=
if [[ -n $previous_container ]]; then
  previous_image=$(docker inspect --format '{{.Config.Image}}' "$previous_container")
fi
git checkout --detach "$revision"

export PORTFOLIO_IMAGE="arnav-portfolio:$revision"
if ! "${compose[@]}" config --quiet || ! "${compose[@]}" build; then
  git checkout --detach "$previous_revision"
  echo "Build failed; running container was left intact." >&2
  exit 1
fi
if ! "${compose[@]}" up --detach --wait --wait-timeout 90; then
  git checkout --detach "$previous_revision"
  if [[ -n $previous_image ]]; then
    export PORTFOLIO_IMAGE=$previous_image
    "${compose[@]}" up --detach --no-build --wait --wait-timeout 90
    echo "Deployment failed and the previous image was restored." >&2
  else
    "${compose[@]}" stop portfolio
    echo "Initial deployment failed its health check." >&2
  fi
  exit 1
fi
echo "Portfolio deployed at revision $revision"
