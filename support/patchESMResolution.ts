(async function () {
  const {
    promises: { readFile, readdir, writeFile }
  } = await import("fs");
  const { dirname, normalize } = await import("path");
  const { quote } = await import("shell-quote");
  const { fileURLToPath } = await import("url");

  // patch needed due to switching package.json's type to "module"
  // https://github.com/Esri/calcite-components/issues/5141
  try {
    const importedModule = "@stencil/core/internal/client";
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const componentsOutput = quote([normalize(`${__dirname}/../dist/components/`)]);
    const files = await readdir(componentsOutput);
    for (const file of files) {
      const filePath = quote([normalize(`${componentsOutput}/${file}`)]);
      const contents = await readFile(filePath, { encoding: "utf8" });
      await writeFile(filePath, contents.replace(importedModule, importedModule + "/index.js"));
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
