import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { exists } from "$std/fs/exists.ts";
import { DOCS } from "routes/api/index.ts";

export default defineConfig({
  plugins: [tailwind()],
  server: {
    onListen: () => {
      console.log(
        "%cServidor iniciado en http://localhost:8000.\n",
        "color: green",
      );

      exists("reports.json").then(async (exists) => {
        if (!exists) {
          return;
        }

        try {
          DOCS.push(...JSON.parse(await Deno.readTextFile("reports.json")));

          console.log("%cPartes cargados.", "color: blue");
        } catch (e) {
          console.error(
            "%cError al leer el archivo de partes: " + e.message,
            "color: red",
          );
        }
      });
    },
  },
});
