# DESIGN.md

Visual and interaction design for **get-my-life-in-order**. Follow this document whenever you choose colors, type, spacing, motion, or component appearance. Architecture and HTMX rules live in [AGENT.md](AGENT.md). This file owns look, feel, and visual comfort.

## Intent

The product is a personal life organizer. The interface must stay out of the way: practical, easy to use, and easy to read. Appearance supports work; it is never the work.

## Non-Negotiables

- Prefer a **monochromatic** surface. Hue is a theme, not decoration.
- Optimize for **practicality, ease of use, and readability** before novelty or visual flourish.
- Express color through a small set of tokens so the whole application can change palette by swapping those tokens, not by restyling components.
- Ship first as a **dark monochromatic** theme, close to black.
- Always **validate color against eye strain** before adopting it. Reject combinations that glare, vibrate, or wash out text.
- Avoid **shadows** and **highly animated effects**. Depth comes from contrast and spacing, not glow or motion.

---

## 1. Monochrome as the Default

### Palette, not rainbow

- Build the UI from tints and shades of a single hue (initially near-neutral / near-black). Backgrounds, surfaces, borders, body text, muted text, and controls must belong to the same family.
- Do not use Bootstrap's saturated semantic colors (`danger`, `warning`, `success`, `info`, `primary` as rainbow accents) to paint the interface. Status is communicated with labels, structure, and restrained tone shifts inside the monochrome scale.
- One optional accent is allowed for the current focus or the primary action. It must be a slightly lighter or cooler step of the same palette, never a competing hue.

### Why monochrome

- A single family of tones keeps long sessions quieter and easier to scan.
- Swapping the application color means changing the token values (CSS custom properties that feed Bootstrap), not hunting class names across templates. Layout and components stay the same; only the tokens move.

### Theme tokens

- Own color in CSS custom properties that map onto Bootstrap 5 variables (`--bs-body-bg`, `--bs-body-color`, `--bs-border-color`, `--bs-tertiary-bg`, `--bs-secondary-color`, and the equivalent surface / contrast tokens).
- Templates use Bootstrap utilities and components. They must not hard-code hex values, rgb(), or one-off color classes that bypass the token set.
- Changing theme = changing token values (and `data-bs-theme`). Do not introduce a second styling system.

---

## 2. Initial Theme: Dark, Near Black

- Default appearance is dark monochromatic, close to black, with `data-bs-theme="dark"` on the document.
- Page background sits near black but is not forced to pure `#000000` if a slightly lifted charcoal reduces halo and smearing on common displays.
- Surfaces (cards, nav, list groups, modals) step up from the page in small, even increments. Two or three surface levels are enough. Do not stack many gray layers.
- Borders are hairline and low-contrast against their surface: visible as structure, not as frames.
- Body text is a soft off-white, not pure `#FFFFFF` on pure black. Muted text stays readable; it is dimmer, not faint.

---

## 3. Comfort and Readability

Treat every color choice as a comfort check, not only a brand check.

Always ask:

- Does body text keep a strong contrast against its surface (aim for WCAG AA at minimum for text and controls)?
- Does the pair vibrate, bloom, or sting after a few seconds of staring (saturated color on dark, pure white on pure black, thin light type on charcoal)?
- Are large areas of the brightest token avoided? Reserve the lightest step for text and small controls, not full-bleed panels.
- Does muted text remain readable at body size, not only at a glance from a designer’s screen?

Reject or retune any token that fails those checks. Prefer slightly less contrast than a “crisp” marketing dark theme if the softer pair is easier to live with.

### Type and density

- Prefer Bootstrap’s default type scale and native form controls. Do not shrink body copy to pack more onto the screen.
- Keep line length readable: constrain main content with Bootstrap containers rather than stretching text across the full viewport.
- Spacing does the grouping. Use Bootstrap spacing utilities (`m-*`, `p-*`, `gap-*`) consistently. Do not compensate for weak hierarchy with color or shadow.

### Interaction clarity

- Primary actions look like the one thing to do next: solid, high-contrast within the monochrome scale.
- Secondary actions stay outline or ghost. Destructive actions stay visually quiet until confirmation; do not rely on a bright red fill as the only warning.
- Hit targets stay comfortable (Bootstrap’s default button and form sizes). Do not compact controls to look “dense.”

---

## 4. No Shadows, Quiet Motion

- Do not use `box-shadow`, drop shadows, glows, or text shadows to fake elevation. Separate layers with background steps, borders, and spacing.
- Do not add decorative animation: bounce, pulse, shake, looping loaders, gradient drift, or attention-seeking transitions.
- HTMX swaps must be instant or use the shortest possible fade. Prefer no swap animation. Never animate layout (no sliding pages, no bouncing list items).
- Bootstrap components that animate by default (collapse, modal backdrop) may keep their native, brief behavior. Do not extend duration, add bounce, or stack extra effects on top.
- Respect `prefers-reduced-motion`: if the user asks for reduced motion, motion must be off.

---

## 5. Structure and contracts

The three-region shell, URL shape, HTMX swap targets, and template split are defined in [DESIGN_CONTRACTS.md](DESIGN_CONTRACTS.md). Follow that document whenever you add a feature, a sidebar item, or a page. Do not invent a parallel chrome.

---

## 6. Relationship to AGENT.md

[AGENT.md](AGENT.md) still governs architecture, HTMX, and Bootstrap usage. Design does not override those rules.

- **Zero custom CSS** remains the default for layout and components. The justified exception is the **theme token layer**: a small, commented stylesheet that only assigns CSS custom properties for color (and, if required, motion). No new class names for appearance.
- Prefer native Bootstrap utilities and `data-bs-*` behavior. Do not invent a parallel design system.
- Fragments and full pages share the same tokens. A fragment must look correct when swapped into a page because color comes from the document theme, not from the fragment.

When visual work and architectural work conflict, keep the server-first / HTMX contract and solve the visual need with tokens and Bootstrap primitives.
