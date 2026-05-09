import fs from "node:fs";
import path from "node:path";

const appPath = path.resolve("src/App.jsx");
const mainPath = path.resolve("src/main.jsx");
const pkgPath = path.resolve("package.json");

const requiredFiles = [appPath, mainPath, pkgPath, path.resolve("vite.config.js"), path.resolve("capacitor.config.ts")];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    throw new Error(`Eksik dosya: ${file}`);
  }
}

const app = fs.readFileSync(appPath, "utf8");
const main = fs.readFileSync(mainPath, "utf8");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

const assertions = [
  [app.includes("export default function EvrimGame"), "App.jsx default export içermiyor."],
  [main.includes("createRoot"), "main.jsx React createRoot kullanmıyor."],
  [pkg.scripts?.build === "vite build", "package.json build script beklenen değerde değil."],
  [pkg.scripts?.["cap:sync"], "Capacitor sync script eksik."],
  [app.includes("validateDiscoveryGraph"), "v2 validator altyapısı App.jsx içinde görünmüyor."],
  [app.includes("SAVE_SCHEMA_VERSION"), "Save schema version altyapısı App.jsx içinde görünmüyor."]
];

const failures = assertions.filter(([ok]) => !ok).map(([, message]) => message);

if (failures.length) {
  console.error("Kaynak doğrulama başarısız:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Kaynak doğrulama başarılı.");
