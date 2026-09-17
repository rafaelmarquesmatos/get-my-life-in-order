import { Router } from "express";
import { features, financeiro, financeiroSubnav } from "../data/financeiro.js";
import { renderPage } from "../render.js";

export const financeiroRouter = Router();

function pageContext(activeSubfeature, pageTitle) {
  return {
    pageTitle,
    features,
    subnav: financeiroSubnav,
    activeFeature: "financeiro",
    activeSubfeature,
    financeiro,
  };
}

financeiroRouter.get("/", (_req, res) => {
  res.redirect("/financeiro/dashboard");
});

financeiroRouter.get("/financeiro", (_req, res) => {
  res.redirect("/financeiro/dashboard");
});

financeiroRouter.get("/financeiro/dashboard", (_req, res) => {
  renderPage(
    res,
    "pages/financeiro/dashboard.njk",
    pageContext("dashboard", "Dashboard"),
  );
});

financeiroRouter.get("/financeiro/salario", (_req, res) => {
  renderPage(
    res,
    "pages/financeiro/salario.njk",
    pageContext("salario", "Salário"),
  );
});

financeiroRouter.get("/financeiro/contas", (_req, res) => {
  renderPage(
    res,
    "pages/financeiro/contas.njk",
    pageContext("contas", "Contas a Pagar"),
  );
});

financeiroRouter.get("/financeiro/recorrentes", (_req, res) => {
  renderPage(
    res,
    "pages/financeiro/recorrentes.njk",
    pageContext("recorrentes", "Recorrentes"),
  );
});
