import Message from "components/message/Message.tsx";
import { useSignal } from "@preact/signals";
import Report from "types/Report.ts";
import IconChevronDown from "tabler-icons/chevron-down.tsx";
import IconChevronUp from "tabler-icons/chevron-up.tsx";
import IconCurrencyDollar from "tabler-icons/currency-dollar.tsx";
import IconExternalLink from "tabler-icons/external-link.tsx";
import IconId from "tabler-icons/id.tsx";
import IconPhone from "tabler-icons/phone.tsx";
import IconDatabase from "tabler-icons/database.tsx";
import IconCalendarTime from "tabler-icons/calendar-time.tsx";
import IconTrash from "tabler-icons/trash.tsx";

const TITLE_CONTENT_CLASS =
  "flex flex-col items-center justify-items-center gap-2" as const;

export default function (
  { report, alwaysShowDetails = false, goto = false, deleteable = false }: {
    report: Report;
    alwaysShowDetails?: boolean;
    goto?: boolean;
    deleteable?: boolean;
  },
) {
  let { id, incident, item, insurance } = report;
  insurance = insurance ?? {};
  incident = incident ?? {};

  const { name, image } = item ?? {};
  const { type, what, how, when, cause, cost } = incident;

  const show = useSignal(false);

  const details = (
    <div
      className={`w-full h-full grid ${
        (what || how || when) &&
          Object.values(insurance).some((x) => x)
          ? "grid-cols-2"
          : "grid-cols-1"
      } items-baseline justify-items-center gap-6`}
    >
      {(what || how || when) && (
        <div className="grid grid-cols-1 items-baseline justify-items-center gap-6">
          {what && (
            <div className={TITLE_CONTENT_CLASS}>
              <h2 className="text-lg font-medium">
                Resumen de la incidencia
              </h2>

              <p className="text-pretty break-words align-middle">
                {what}
              </p>
            </div>
          )}

          {how && (
            <div className={TITLE_CONTENT_CLASS}>
              <h2 className="text-lg font-medium">
                Detalles del suceso
              </h2>

              <p className="text-pretty break-words align-middle">
                {how}
              </p>
            </div>
          )}

          {when && (
            <div className={TITLE_CONTENT_CLASS}>
              <h2 className="text-lg font-medium">
                Fecha y hora
              </h2>

              <p className="text-pretty break-words align-middle">
                {new Date(when).toLocaleDateString("es-ES")}
              </p>
            </div>
          )}
        </div>
      )}

      {Object.values(insurance).some((x) => x) && (
        <div className="grid grid-cols-1 items-baseline justify-items-start gap-6">
          <h2
            className={"!text-lg !font-medium " +
              TITLE_CONTENT_CLASS}
          >
            Detalles del asegurado
          </h2>

          {!!insurance.number && (
            <div className={TITLE_CONTENT_CLASS}>
              <span className="flex flex-row gap-2">
                <IconDatabase
                  class="text-slate-700"
                  size={24}
                />

                {`Asegurado ${insurance.number}`}
              </span>
            </div>
          )}

          {!!insurance.coverage && (
            <div className={TITLE_CONTENT_CLASS}>
              <span className="flex flex-row gap-2">
                <IconCurrencyDollar
                  class="text-slate-700"
                  size={24}
                />

                {`Cobertura ${insurance.coverage.toLocaleLowerCase("es-ES")}`}
              </span>
            </div>
          )}

          {!!insurance.phone && (
            <div className={TITLE_CONTENT_CLASS}>
              <span className="flex flex-row gap-2">
                <IconPhone
                  class="text-slate-700"
                  size={24}
                />

                {insurance.phone}
              </span>
            </div>
          )}

          {!!insurance.id && (
            <div className={TITLE_CONTENT_CLASS}>
              <span className="flex flex-row gap-2">
                <IconId
                  class="text-slate-700"
                  size={24}
                />

                {insurance.id}
              </span>
            </div>
          )}

          {!!insurance.expiration && (
            <div className={TITLE_CONTENT_CLASS}>
              <span className="flex flex-row gap-2">
                <IconCalendarTime
                  class="text-slate-700"
                  size={24}
                />

                {`Expira el ${
                  new Date(insurance.expiration).toLocaleDateString("es-ES")
                }`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const main = (
    <Message
      extend
      banner={
        <a target="_blank" href={image}>
          <img class="w-96" src={image} />
        </a>
      }
      title={name}
      message={type}
    >
      {(what || how || when || Object.values(insurance).some((x) => x)) &&
        (
          <>
            {alwaysShowDetails && details}

            {!alwaysShowDetails && (
              <div className="w-full relative flex flex-col items-center justify-items-center gap-4">
                {show.value && (
                  <>
                    <button onClick={() => show.value = false}>
                      <IconChevronUp class="text-slate-700" size={32} />
                    </button>

                    {details}
                  </>
                )}

                {!show.value && (
                  <button onClick={() => show.value = true}>
                    <IconChevronDown class="text-slate-700" size={32} />
                  </button>
                )}
              </div>
            )}
          </>
        )}
    </Message>
  );

  return (
    <div className="relative w-full">
      {goto && id && (
        <a
          href={`/reports/${id}`}
          target="_blank"
          className="absolute -right-2.5 -top-3 hover:animate-pulse"
        >
          <IconExternalLink size={32} class="text-slate-700" />
        </a>
      )}

      {main}

      {deleteable && id && (
        <form
          className="absolute -right-2.5 -bottom-3 hover:animate-pulse"
          action="javascript:void(0);"
          method="POST"
          onSubmit={(e: SubmitEvent) => {
            e.stopImmediatePropagation();
            e.preventDefault();

            fetch(`/api/${id}`, { method: "DELETE" })
              .then((r) => {
                if (!r.ok) {
                  throw new Error(
                    "No se pudo eliminar el parte: " + r.statusText,
                  );
                }

                location.reload();
              })
              .catch((e) => alert(e.message));
          }}
        >
          <button type="submit">
            <IconTrash size={32} class="text-slate-700" />
          </button>
        </form>
      )}
    </div>
  );
}
