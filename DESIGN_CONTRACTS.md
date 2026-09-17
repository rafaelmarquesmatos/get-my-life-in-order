# DESIGN_CONTRACTS.md

Layout and navigation contracts for **get-my-life-in-order**. Visual language lives in [DESIGN.md](DESIGN.md). Architecture, HTMX, and Bootstrap usage live in [AGENT.md](AGENT.md). This file owns the three-region shell, URL shape, swap targets, and template split that every feature must follow.

## Non-Negotiables

- Every feature sits inside the same three-region shell. Do not invent a fourth region or a feature-specific chrome.
- Every subfeature has a real URL of the form `/{feature}/{subfeature}`. Direct navigation, refresh, and bookmarks must work.
- Primary HTMX target is always `#main-content`. Secondary chrome (`#feature-subnav`, `#feature-rail`) updates out of band.
- Page templates never emit `<html>`, `<head>`, or the sidebars. They render correctly in isolation.

---

## 1. Three Regions

The shell is a full-height row of three regions. IDs are stable and required.

| Region | ID | Role |
| --- | --- | --- |
| Feature rail | `#feature-rail` | Primary sidebar. Chooses the active feature. |
| Feature subnav | `#feature-subnav` | Adjacent secondary sidebar. Lists subfeatures of the active feature. |
| Main content | `#main-content` | Body of the current subfeature. |

Rules:

- `#feature-rail` lists every feature. The current feature is marked active. Features that are not yet built are present but `disabled` so the rail is never empty of future intent.
- `#feature-subnav` lists only the subfeatures of the active feature. The current subfeature is marked active.
- `#main-content` is the only region whose inner HTML is the primary swap target.
- Width and spacing come from Bootstrap utilities (`d-flex`, `flex-column`, `vh-100`, `border-end`, `list-group`). No presentational class names.

---

## 2. URL Model

Pattern: `/{feature}/{subfeature}`.

Examples:

- `/financeiro/dashboard`
- `/financeiro/salario`
- `/financeiro/contas`
- `/financeiro/recorrentes`

Rules:

- `GET /` and `GET /{feature}` redirect to the feature's default subfeature (Financeiro defaults to `/financeiro/dashboard`).
- Every URL remains shareable, bookmarkable, and refreshable. A user pasting an HTMX-driven URL into a new tab receives a complete, usable page (see Dual-Response Contract in [AGENT.md](AGENT.md)).
- Do not create a parallel URL namespace for HTMX. The same route serves both full documents and fragments.

---

## 3. Swap Contract

Obeys the Dual-Response Contract and out-of-band rules in [AGENT.md](AGENT.md).

Primary swap:

- Every rail and subnav link uses native HTMX attributes: `hx-get`, `hx-target="#main-content"`, `hx-swap="innerHTML"`, `hx-push-url="true"`.
- The same element is a real `<a href>` so navigation works without JavaScript.

Out-of-band:

- An HTMX response for a subfeature also returns `#feature-subnav` with `hx-swap-oob="true"` so the active subnav item moves.
- The same response returns `#feature-rail` with `hx-swap-oob="true"` so the active feature stays in sync (needed when the rail itself was the click, and harmless when the subnav was).
- OOB payloads are the regions themselves, not the whole shell.

Clicking a subnav item therefore swaps `#main-content` and refreshes the subnav (and rail) out of band. It never reloads the page.

---

## 4. Template Contract

Nunjucks has no fragment API. Split templates instead of rendering a subsection of a larger file.

- `src/views/shell.njk` is the document: `<html>`, `<head>`, `#feature-rail`, `#feature-subnav`, `#main-content`.
- Each subfeature has its own content template under `src/views/pages/{feature}/{subfeature}.njk`.
- Direct navigation renders `shell.njk`, which includes the content template via `{% include contentTemplate %}`.
- An HTMX request (`HX-Request: true`) renders the content template alone, plus the OOB regions.
- Detection lives in one place: a request helper that branches on `HX-Request` and chooses `shell.njk` versus the page template. Do not duplicate that branch across routes.

### Fragment contract

A template under `pages/` must:

- Never emit `<html>`, `<head>`, `<body>`, `#feature-rail`, or `#feature-subnav` as part of its own markup.
- Render correctly when returned in isolation as the HTMX fragment (the children of `#main-content`).
- Receive all data it needs as explicit template context. Do not rely on layout-only locals.

When the response is an HTMX fragment, the server appends the OOB copies of `#feature-rail` and `#feature-subnav` after the page template. Those copies are not part of the page template itself.

---

## 5. Financeiro (first feature)

Until other features exist, the rail contains Financeiro as the only enabled item. Subnav items:

| Label | URL |
| --- | --- |
| Dashboard | `/financeiro/dashboard` |
| Salário | `/financeiro/salario` |
| Contas a Pagar | `/financeiro/contas` |
| Recorrentes | `/financeiro/recorrentes` |

This phase renders mock data only. No persistence, no POST handlers, no derived totals.
