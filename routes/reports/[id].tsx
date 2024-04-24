import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import ReportDisplayer from "islands/ReportDisplayer.tsx";
import Report from "types/Report.ts";

export const handler: Handlers<{ report: Report }> = {
  async GET(req, ctx) {
    const r = await fetch(
      new URL("/api/" + ctx.params.id, new URL(req.url).origin),
      { method: "GET" },
    );

    if (!r.ok) {
      if (r.status === 404) {
        return await ctx.renderNotFound();
      }

      throw new Error("No se pudo obtener los partes: " + await r.text());
    }

    const report = await r.json();

    return await ctx.render({ report });
  },
};

export default function ({ data }: PageProps<{ report: Report }>) {
  return <ReportDisplayer {...data} alwaysShowDetails />;
}
