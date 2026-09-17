# AGENT.md

Guidance for all AI agents working on **get-my-life-in-order**, a personal life organizer built on a server-first architecture with HTMX and Bootstrap 5.3.x. The server owns the application; the browser is a rendering surface that requests HTML and swaps it into place. Follow every directive below unless the user explicitly overrides it.

Visual language — monochrome, readability, dark theme, motion, and color tokens — is defined in [DESIGN.md](DESIGN.md). Follow that document for all appearance decisions. Do not invent a parallel look.

## Non-Negotiables

- All business logic, validation, and state live on the server.
- No SPA patterns: no client-side routing, no client-side state store, no JSON-to-DOM rendering.
- No custom CSS when a native Bootstrap 5 utility or component can express the requirement. Theme color is the exception documented in [DESIGN.md](DESIGN.md): a small token layer of CSS custom properties, not new presentational classes.
- No hand-written JavaScript for behavior that HTMX attributes or Bootstrap's `data-bs-*` API already provide.
- Appearance follows [DESIGN.md](DESIGN.md): monochromatic, practical, easy to read, initially near-black, no shadows, no flashy motion.

---

## 1. Core Architecture and Philosophy

### Server-First

- Implement all business logic, authorization checks, and data validation on the server. Never re-implement a rule in the browser.
- Keep application state on the server. The client must not hold a canonical copy of tasks, filters, counters, or any other domain data.
- Render all templates on the server. Endpoints return HTML, not JSON, unless an endpoint exists specifically to serve a machine consumer.
- Treat client-side code as presentation only. The browser may toggle visual affordances; it must never make a business decision.

### Separation of Concerns

- Maintain a clear boundary between **full-page layouts** (top-level route views) and **reusable component fragments/partials**.
- A layout owns the document shell: `<html>`, `<head>`, navigation, and the global page chrome. It composes fragments; it is never returned as part of a fragment response.
- A fragment must be renderable standalone. It must not depend on variables, wrappers, or context that only the layout provides.
- Give each fragment a single responsibility (one task row, one counter badge, one form). Compose complex views from small fragments instead of growing one large template.
- When a fragment needs data, pass it explicitly. Do not rely on implicit globals injected by the layout.

### Dual-Response Contract

Every route that participates in HTMX interactions must serve two response shapes from the same handler:

- **Direct navigation or full page load** returns a complete HTML document: layout plus content.
- **HTMX request** (identified by the `HX-Request` header) returns only the isolated HTML fragment, with no layout wrapper.

Rules:

- Branch on the `HX-Request` header inside the handler. Do not create duplicate routes or parallel URL namespaces for the two modes.
- Every URL must remain shareable, bookmarkable, and refreshable. A user pasting an HTMX-driven URL into a new tab must receive a complete, usable page.
- Never return a fragment to a direct navigation request, and never return a full document to an HTMX swap.

---

## 2. HTMX Standards and Best Practices

### Prefer Native Attributes

- Always use native HTMX attributes for server interaction: `hx-get`, `hx-post`, `hx-put`, `hx-delete`, `hx-patch`.
- Do not write `fetch` or `XMLHttpRequest` wrappers for behavior HTMX already covers.
- Express triggers, confirmations, and loading states declaratively with `hx-trigger`, `hx-confirm`, and `hx-indicator` rather than with custom event listeners.

### Granular UI Updates

- Never trigger a full-page refresh for a scoped action.
- Every interactive element must declare an explicit `hx-target` and an intentional `hx-swap`. Do not rely on defaults by accident; choose the swap strategy deliberately.
- Scope each swap to the smallest element that must change. Deleting a task removes only that task's DOM node; editing a task swaps only that task's markup.

```html
<button
  hx-delete="/tasks/42"
  hx-target="#task-42"
  hx-swap="outerHTML"
  class="btn btn-sm btn-outline-secondary">
  Delete
</button>
```

- Give every swappable element a stable, predictable `id` (for example `id="task-42"`) so targets stay reliable across renders.
- Return a fragment whose shape matches the chosen swap strategy: `outerHTML` requires the replacement element itself, `innerHTML` requires only the children, and a delete-style swap returns an empty body.

### Out-of-Band Updates

- Use `hx-swap-oob` deliberately when a secondary UI element must update alongside the primary action: counters, status badges, summary totals, empty-state messages.
- Mark out-of-band elements explicitly in the response and keep their payload minimal: send the badge, not the panel that contains it.
- Each out-of-band element must carry the `id` of the element it replaces in the DOM.

```html
<!-- Primary swap target -->
<li id="task-42" class="list-group-item">...</li>

<!-- Secondary, out-of-band update -->
<span id="pending-count" hx-swap-oob="true" class="badge text-bg-secondary">7</span>
```

- Do not use out-of-band swaps as a shortcut for re-rendering large regions. If many regions change at once, reconsider the interaction design.

---

## 3. Bootstrap 5 Conventions

### Zero Custom CSS

- Build every interface exclusively from native Bootstrap 5 classes: grid (`container`, `row`, `col-*`), flexbox utilities (`d-flex`, `justify-content-*`, `align-items-*`), spacing (`m-*`, `p-*`, `gap-*`), colors (`text-*`, `bg-*`, `text-bg-*`), and typography and display utilities.
- Color utilities must resolve through the theme tokens in [DESIGN.md](DESIGN.md). Do not pick saturated Bootstrap palette classes (`text-bg-danger`, `btn-warning`, and the like) to decorate the UI.
- Use Bootstrap components as provided: cards, list groups, badges, alerts, modals, forms, buttons, navs.
- Write custom CSS only when no combination of standard Bootstrap utilities can achieve the requirement. When that happens, keep the rule minimal, scope it tightly, and state the justification in a comment. The approved exception is the DESIGN.md token layer that maps CSS custom properties onto Bootstrap variables.
- Do not invent new class names for styling purposes. Reserve custom classes for JavaScript or HTMX hooks, never for appearance.

### Native Bootstrap JavaScript

- Prefer Bootstrap's declarative `data-bs-*` API over custom JavaScript: `data-bs-toggle`, `data-bs-target`, `data-bs-dismiss`, `data-bs-placement`.
- Use built-in component behavior for modals, dropdowns, collapse, offcanvas, toasts, and tooltips instead of reimplementing show/hide logic.
- Instantiate a Bootstrap component programmatically only when a data attribute cannot express the need, such as initializing components inside content that HTMX has just swapped in.
- Compose layout from Bootstrap primitives. Reach for a utility class before writing a style, and for a component before writing a script.
