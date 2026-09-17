import express from "express";
import nunjucks from "nunjucks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { financeiroRouter } from "./routes/financeiro.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const port = Number(process.env.PORT) || 3000;

const app = express();

nunjucks.configure(path.join(__dirname, "views"), {
  autoescape: true,
  express: app,
  noCache: process.env.NODE_ENV !== "production",
});
app.set("view engine", "njk");

app.use((req, res, next) => {
  res.locals.isHtmx = req.get("HX-Request") === "true";
  next();
});

app.use("/css", express.static(path.join(root, "public/css")));
app.use(
  "/vendor/bootstrap",
  express.static(path.join(root, "node_modules/bootstrap/dist")),
);
app.use(
  "/vendor/htmx",
  express.static(path.join(root, "node_modules/htmx.org/dist")),
);

app.use(financeiroRouter);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
