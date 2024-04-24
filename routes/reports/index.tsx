import { Handlers, PageProps } from "$fresh/server.ts";
import Report from "types/Report.ts";
import ReportDisplayer from "islands/ReportDisplayer.tsx";
import Message from "components/message/Message.tsx";
import IconZzz from "tabler-icons/zzz.tsx";
import Chat from "islands/Chat.tsx";

export const handler: Handlers<{ reports: Report[] }> = {
  async GET(req, ctx) {
    const r = await fetch(new URL("/api", new URL(req.url).origin));

    if (!r.ok) {
      throw new Error("No se pudo obtener los partes: " + await r.text());
    }

    const reports = await r.json();

    return await ctx.render({ reports });
  },
};

export default function ({ data }: PageProps<{ reports: Report[] }>) {
  if (!data.reports.length) {
    return (
      <Message
        banner={<IconZzz size={48} class="text-slate-700" />}
        message={"Parece que no tienes ningún parte registrado."}
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        className={`w-full h-full grid ${
          data.reports.length <= 1
            ? "grid-cols-1"
            : data.reports.length == 2
            ? "grid-cols-2"
            : "grid-cols-3"
        } items-baseline justify-items-center gap-8`}
      >
        {data.reports.map((report) => (
          <ReportDisplayer deleteable goto report={report} />
        ))}
      </div>

      <div className="fixed botom-1/4 right-[10%]">
        <Chat
          init={"¡Hola! ¿Necesitas asistencia con alguna de tus incidencias previas?"}
        />
      </div>
    </div>
  );
}
