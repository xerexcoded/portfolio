# Domain routing

The portfolio is served by the Xenix container. Vercel provides HTTPS and proxies only the portfolio path on the existing Kachal project. These project-level rules persist across application deployments; no Kachal source files were changed.

- Public URL: https://kachal.ai/portfolio/
- Existing apex redirect: `kachal.ai` → `www.kachal.ai` (preserves the path)
- Vercel project: `v0-katxchal-landing-page`
- Project ID: `prj_Ejpa4aN2fxwL4X7DiX9hvyN1wCBq`
- Team ID: `team_kLWLODW8pqW9AxALt4qjj9zL`
- Published routing version: `895ec612-e72e-4dff-9f64-bccf41ea5669`
- Prior routing version: `5716c085-02fe-46df-9a5d-e57a5c2d75d3`

Published on 2026-10-09 after inspecting the staged diff. The existing Ring of Fire rule remained unchanged; the following two rules were appended in this order:

| Rule | ID | Source regex | Destination |
| --- | --- | --- | --- |
| Portfolio Xenix document proxy | `5fc60161-9e15-4f8a-9b2d-bb0c46bd6913` | `^/portfolio/?$` | `http://200.97.172.197/portfolio/` |
| Portfolio Xenix assets and subpaths | `231ecc9e-438b-4fb7-88cd-2aa06b211ad3` | `^/portfolio/(.*)$` | `http://200.97.172.197/portfolio/$1` |

Both are enabled external rewrites with `srcSyntax: "regex"` and `respectOriginCacheControl: true`. The exact document rule sends either slash form to the origin's trailing-slash URL, preventing a loop between Next.js slash normalization and the origin redirect. The subpath rule preserves the `/portfolio/` prefix that Caddy strips before forwarding to nginx.

Manage these through the Vercel project's routing rules, or the authenticated Vercel API under `/v1/projects/{projectId}/routes`. Stage changes, inspect their diff against production, and promote only the intended version. Do not restore the recorded prior version after unrelated routing changes have been published; it would replace the entire route set. See [Vercel project routing rules](https://vercel.com/docs/routing/project-routing-rules).

Verification after publication: both `www.kachal.ai/portfolio` slash forms returned 200; apex URLs kept their existing 307 redirect; linked JavaScript/CSS and the redacted PDF returned 200; the PDF matched the local published copy; `/portfolio/healthz` returned 200; a missing immutable asset returned 404. The homepage and Ring of Fire remained available with 200 responses.
