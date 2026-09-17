export function renderPage(res, contentTemplate, context = {}) {
  const locals = {
    ...context,
    contentTemplate,
    oob: Boolean(res.locals.isHtmx),
  };

  if (res.locals.isHtmx) {
    return res.render("htmx.njk", locals);
  }

  return res.render("shell.njk", locals);
}
