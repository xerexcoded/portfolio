# Arnav's portfolio

A React and TypeScript portfolio with a solar-punk visual direction, a pinned Nix development environment, and a small production Nginx container.

The portfolio runs on Xenix at [http://200.97.172.197/portfolio/](http://200.97.172.197/portfolio/); its intended public address is [https://kachal.ai/portfolio/](https://kachal.ai/portfolio/). Its public resume copy omits the private contact line. The source repository has been created at [xerexcoded/portfolio](https://github.com/xerexcoded/portfolio), and publishing the source awaits explicit approval. SSH access remains unchanged as requested. `DEPLOY_ENABLED=false` keeps automatic SSH deployment disabled, and updates use the existing administrator connection. No private deployment key has been uploaded to GitHub.

## Development

```sh
nix develop
npm ci
npm run dev
```

Vite serves the site at `http://127.0.0.1:5173`. If you use direnv, run `direnv allow` once to load `.envrc` automatically.

```sh
nix develop --command npm test
nix develop --command npm run build
nix develop --command npm run preview
```

The Nix flake supports Apple Silicon, Intel macOS, and ARM/x86 Linux. `flake.lock` pins the Node 22 environment. Commit `package-lock.json` together with dependency changes.

## Production container

```sh
docker compose config --quiet
docker compose up --build --detach --wait
curl --fail http://127.0.0.1:8080/healthz
```

Open `http://127.0.0.1:8080`. The container serves the built static site as UID 101, with a read-only filesystem and a temporary directory for Nginx. Hashed assets receive long cache lifetimes; the HTML document is revalidated on every load. The build and runtime base images are pinned by digest.

```sh
docker compose logs --tail 100
docker compose down
```

Set `PORTFOLIO_PORT` to change the host port. The default bind address is `127.0.0.1`, suitable for a native reverse proxy. Set `PORTFOLIO_BIND=0.0.0.0` only when direct public HTTP is intended.

## Xenix deployment

The configuration follows [Ring of Fire's deployment pattern](https://github.com/xerexcoded/ring-of-fire/tree/main/.github/workflows): CI checks the app and production image, then a restricted SSH key deploys the exact tested commit on Xenix. This portfolio uses a separate `deploy-portfolio` command and Compose project.

For a one-off deployment using an ordinary SSH account with Docker access:

```sh
PORTFOLIO_PORT=8088 VITE_BASE_PATH=/portfolio/ ./deploy/deploy.sh xerexcoded@200.97.172.197 /srv/portfolio
```

This uploads a new release directory, builds it before replacing the running service, and waits for its health check. The local `xenix` name is a shell alias for `ssh xerexcoded@200.97.172.197`; use the explicit address in scripts. No files in earlier release directories are deleted. The isolated public route is `http://200.97.172.197/portfolio/`, with Ring of Fire's existing routes preserved.

The automatic deployment workflow is prepared but disabled. The module does not change SSH `AllowUsers`; Xenix currently permits only the existing administrator, so the separate deployment identity cannot log in. Do not enable this workflow while preserving that access policy. If automatic deployment is authorized in a future configuration:

1. Publish this repository with a `main` branch.
2. Copy `deploy/nixos-portfolio.nix` and `deploy/server-deploy.sh` into `/etc/nixos/modules/portfolio/` as `default.nix` and `server-deploy.sh`.
3. Set the module's `deploymentPublicKey` to the portfolio deployment public key, then import `../../modules/portfolio` in `/etc/nixos/hosts/xenix/default.nix`.
4. Build and switch the NixOS configuration. The module creates the `portfolio-deploy` account, its restricted `/etc/portfolio/deploy` command, `/etc/portfolio.env`, and the isolated `/portfolio/` Caddy route. The default environment uses loopback port 8088.
5. Clone this repository into `/srv/portfolio/repository` as `portfolio-deploy`. This account can fetch the public repository and run Docker Compose. Its SSH key accepts only `deploy-portfolio COMMIT_SHA`; Ring of Fire's deployment account and key remain separate.
6. For a dedicated domain instead, set `VITE_BASE_PATH=/`, use `deploy/Caddyfile.example` with the chosen hostname, and point its DNS at Xenix.
7. Configure these GitHub repository or `production` environment secrets:

| Secret               | Value                                            |
| -------------------- | ------------------------------------------------ |
| `DEPLOY_HOST`        | Reachable Xenix hostname or IP                   |
| `DEPLOY_USER`        | Portfolio deployment account                     |
| `DEPLOY_SSH_KEY`     | Private key for the restricted portfolio command |
| `DEPLOY_KNOWN_HOSTS` | Verified SSH host key entry for Xenix            |

Set the GitHub repository variable `DEPLOY_ENABLED=true` after the restricted key and secrets are configured. Successful CI on `main` then triggers deployment; a manual workflow run on `main` is also available. Until that variable is enabled, deployment jobs are skipped. `deploy/server-deploy.sh` accepts only the full commit SHA of the current `origin/main` tip, refuses a dirty checkout, serializes deployments, and restores the previous image if the new container fails to become healthy. Delayed jobs cannot replace a newer deployment with an older revision. Build failures leave the running service intact.

The deployment script defaults to `/srv/portfolio/repository` and `/etc/portfolio.env`. For a different layout, set `PORTFOLIO_REPO` and `PORTFOLIO_ENV_FILE` in the installed server script or its trusted server environment.
