import { Handlers } from "$fresh/server.ts";
import { DOCS, FILENAME } from "routes/api/index.ts";
import Report from "types/Report.ts";

export const handler: Handlers = {
  GET(_, ctx) {
    const { id } = ctx.params;

    if (!Report.ID.Regex.test(id)) {
      return new Response("Invalid ID.", { status: 400 });
    }

    const report = DOCS.find((r) => r.id === id);

    if (!report) {
      return new Response("Not found.", { status: 404 });
    }

    return new Response(JSON.stringify(report, null, 4), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },

  DELETE(_, ctx) {
    const { id } = ctx.params;

    if (!Report.ID.Regex.test(id)) {
      return new Response("Invalid ID.", { status: 400 });
    }

    const idx = DOCS.findIndex((r) => r.id === id);

    if (idx === -1) {
      return new Response("Not found.", { status: 404 });
    }

    const doc = DOCS[idx];

    DOCS.splice(idx, 1);

    Deno.writeTextFileSync(
      FILENAME,
      JSON.stringify(DOCS, null, 4),
    );

    return new Response(JSON.stringify(doc, null, 4), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};
