import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import ReportDisplayer from "islands/ReportDisplayer.tsx";
import Report from "types/Report.ts";
import Chat from "islands/Chat.tsx";
import Incident from "types/Incident.ts";

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
  const type: [string, string] = [
    [Incident.Type.Breakage, Incident.Type.Flood].includes(
        data.report.incident.type,
      )
      ? "la"
      : "el",
    Object.values(Incident.Type).find((x) => x == data.report.incident.type)
      ?.toLocaleLowerCase("es-ES") ?? "incidente",
  ];

  return (
    <div className="relative w-full h-full">
      <ReportDisplayer {...data} alwaysShowDetails />

      <div className="fixed botom-1/4 right-[10%]">
        <Chat
          init={`¡Hola! Estamos tramitando el parte sobre ${
            type.join(" ")
          } de tu ${data.report.item.name}. ¿En qué podemos ayudarte?`}
        />
      </div>
    </div>
  );
}
