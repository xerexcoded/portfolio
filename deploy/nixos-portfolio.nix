# Import this alongside the existing Ring of Fire module on Xenix.
{ lib, pkgs, ... }:
let
  # Set the public key for the portfolio GitHub Actions deployment identity.
  deploymentPublicKey = "";
in
{
  users.groups.portfolio-deploy = { };
  users.users.portfolio-deploy = {
    isSystemUser = true;
    group = "portfolio-deploy";
    extraGroups = [ "docker" ];
    home = "/var/lib/portfolio-deploy";
    createHome = true;
    shell = pkgs.bashInteractive;
    openssh.authorizedKeys.keys = lib.optional (deploymentPublicKey != "")
      "restrict,command=\"/etc/portfolio/deploy\" ${deploymentPublicKey}";
  };

  systemd.tmpfiles.rules = [
    "d /srv/portfolio 0755 xerexcoded users - -"
    "d /srv/portfolio/repository 0755 portfolio-deploy portfolio-deploy - -"
  ];

  environment.etc."portfolio.env".text = ''
    COMPOSE_PROJECT_NAME=arnav-portfolio
    PORTFOLIO_BIND=127.0.0.1
    PORTFOLIO_PORT=8088
    VITE_BASE_PATH=/portfolio/
  '';
  environment.etc."portfolio/deploy" = {
    source = ./server-deploy.sh;
    mode = "0755";
  };

  services.caddy.virtualHosts.":80".extraConfig = lib.mkAfter ''
    # Caddy sorts handle_path before the existing catch-all respond directive.
    redir /portfolio /portfolio/ 308
    handle_path /portfolio/* {
      reverse_proxy 127.0.0.1:8088
    }
  '';
}
