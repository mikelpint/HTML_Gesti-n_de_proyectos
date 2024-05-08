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
import Incident from "../types/Incident.ts";

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
  let { incident, item, insurance } = report;
  insurance = insurance ?? {};
  incident = incident ?? {};

  const { name, image, desc } = item ?? {};
  const { type, what, how, when, where, cause, cost } = incident;
  const { id, number, coverage, phone, expiration } = insurance;

  const showIncident = Object.values({ ...incident, type: undefined }).some((
    x,
  ) => x);
  const showInsurance = Object.values(insurance).some((x) => x);

  let labels: {
    cause?: string;
    cost: string;

    what: string;
    how: string;
    when: string;
    where?: string;
  };

  switch (type) {
    case Incident.Type.Breakage: {
      labels = {
        cause: "Causa de la rotura",
        cost: "Coste estimado de la reparación",
        what: "Descripción de la incidencia",
        how: "Detalles del suceso",
        when: "Fecha y hora de la rotura",
      };

      break;
    }

    case Incident.Type.Theft: {
      labels = {
        cost: "Coste estimado de los bienes robados",
        what: "Descripción de la incidencia",
        how: "Detalles del suceso",
        when: "Fecha y hora del robo",
        where: "Ubicación del robo",
      };

      break;
    }

    case Incident.Type.Flood: {
      labels = {
        cost: "Coste estimado de los daños",
        what: "Descripción de la incidencia",
        how: "Detalles del suceso",
        when: "Fecha y hora de la inundación",
        where: "Ubicación de la inundación",
      };

      break;
    }

    case Incident.Type.Fire: {
      labels = {
        cost: "Coste estimado de los daños",
        what: "Descripción de la incidencia",
        how: "Detalles del suceso",
        when: "Fecha y hora del incendio",
        where: "Ubicación del incendio",
      };

      break;
    }

    default: {
      labels = {
        cause: "Causa",
        cost: "Coste estimado",
        what: "Resumen de la incidencia",
        how: "Detalles del suceso",
        when: "Fecha y hora",
      };
    }
  }

  const show = useSignal(false);

  const details = (
    <div
      className={`w-full h-full grid ${
        showIncident &&
          showInsurance
          ? "grid-cols-2"
          : "grid-cols-1"
      } items-baseline justify-items-center gap-6`}
    >
      {showIncident && (
        <div className="grid grid-cols-1 items-baseline justify-items-center gap-6">
          {what && (
            <div className={TITLE_CONTENT_CLASS}>
              <h2 className="text-lg font-medium">
                {labels.what}
              </h2>

              <p className="text-pretty break-words align-middle">
                {what}
              </p>
            </div>
          )}

          {how && (
            <div className={TITLE_CONTENT_CLASS}>
              <h2 className="text-lg font-medium">
                {labels.how}
              </h2>

              <p className="text-pretty break-words align-middle">
                {how}
              </p>
            </div>
          )}

          {cause && (
            <div className={TITLE_CONTENT_CLASS}>
              <h2 className="text-lg font-medium">
                {labels.cause}
              </h2>

              <p className="text-pretty break-words align-middle">
                {cause}
              </p>
            </div>
          )}

          {when && (
            <div className={TITLE_CONTENT_CLASS}>
              <h2 className="text-lg font-medium">
                {labels.when}
              </h2>

              <p className="text-pretty break-words align-middle">
                {new Date(when).toLocaleDateString("es-ES")}
              </p>
            </div>
          )}

          {where && (
            <div className={TITLE_CONTENT_CLASS}>
              <h2 className="text-lg font-medium">
                {labels.where}
              </h2>

              <p className="text-pretty break-words align-middle">
                {where}
              </p>
            </div>
          )}

          {cost !== undefined && (
            <div className={TITLE_CONTENT_CLASS}>
              <h2 className="text-lg font-medium">
                {labels.cost}
              </h2>

              <p className="text-pretty break-words align-middle">
                {cost.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>
          )}
        </div>
      )}

      {showInsurance && (
        <div className="grid grid-cols-1 items-baseline justify-items-start gap-6">
          <h2
            className={"!text-lg !font-medium " +
              TITLE_CONTENT_CLASS}
          >
            Detalles del asegurado
          </h2>

          {!!number && (
            <div className={TITLE_CONTENT_CLASS}>
              <span className="flex flex-row gap-2">
                <IconDatabase
                  class="text-slate-700"
                  size={24}
                />

                {`Asegurado ${number}`}
              </span>
            </div>
          )}

          {!!coverage && (
            <div className={TITLE_CONTENT_CLASS}>
              <span className="flex flex-row gap-2">
                <IconCurrencyDollar
                  class="text-slate-700"
                  size={24}
                />

                {`Cobertura ${coverage.toLocaleLowerCase("es-ES")}`}
              </span>
            </div>
          )}

          {!!phone && (
            <div className={TITLE_CONTENT_CLASS}>
              <span className="flex flex-row gap-2">
                <IconPhone
                  class="text-slate-700"
                  size={24}
                />

                {phone}
              </span>
            </div>
          )}

          {!!id && (
            <div className={TITLE_CONTENT_CLASS}>
              <span className="flex flex-row gap-2">
                <IconId
                  class="text-slate-700"
                  size={24}
                />

                {id}
              </span>
            </div>
          )}

          {!!expiration && (
            <div className={TITLE_CONTENT_CLASS}>
              <span className="flex flex-row gap-2">
                <IconCalendarTime
                  class="text-slate-700"
                  size={24}
                />

                {`Expira el ${
                  new Date(expiration).toLocaleDateString("es-ES")
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
        <>
          {desc && (
            <div className="grid grid-cols-1 items-baseline justify-items-center gap-4">
              <a target="_blank" href={image}>
                <img class="w-96" src={image} />
              </a>

              <small class="text-sm text-pretty text-center align-middle">
                {desc}
              </small>
            </div>
          )}

          {!desc && (
            <a target="_blank" href={image}>
              <img class="w-96" src={image} />
            </a>
          )}
        </>
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
      {goto && report.id && (
        <a
          href={`/reports/${report.id}`}
          target="_blank"
          className="absolute -right-2.5 -top-3 hover:animate-pulse"
        >
          <IconExternalLink size={32} class="text-slate-700" />
        </a>
      )}

      {main}

      {deleteable && report.id && (
        <form
          className="absolute -right-2.5 -bottom-3 hover:animate-pulse"
          action="javascript:void(0);"
          method="POST"
          onSubmit={(e: SubmitEvent) => {
            e.stopImmediatePropagation();
            e.preventDefault();

            fetch(`/api/${report.id}`, { method: "DELETE" })
              .then(async (r) => {
                if (!r.ok) {
                  throw new Error(
                    "No se pudo eliminar el parte: " + await r.text(),
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
