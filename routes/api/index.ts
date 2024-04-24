import { Handlers } from "$fresh/server.ts";
import Report from "types/Report.ts";
import Item from "types/Item.ts";
import Insurance from "types/Insurance.ts";
import Incident from "types/Incident.ts";

export const DOCS: Report[] = [];

export const FILENAME = "reports.json" as const;

const HEX = "0123456789abcdef" as const;

export const handler: Handlers<{ id: string }> = {
  GET() {
    return new Response(JSON.stringify(DOCS, null, 4), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },

  async POST(req) {
    try {
      const { pathname, origin } = new URL(req.url);

      let data: FormData;

      try {
        data = await req.formData();
      } catch {
        return new Response("Datos de formulario inválidos.", { status: 400 });
      }

      const json:
        & Omit<Partial<Report>, "item" | "insurance" | "incident">
        & {
          item?: Partial<Item>;
        }
        & {
          insurance?: Partial<Insurance>;
        }
        & {
          incident?: Partial<Incident>;
        } = {};

      for (
        let [k, v] of Array.from(data.entries()) as [
          | keyof Report
          | `insurance_${keyof Insurance}`
          | `item_${keyof Item}`
          | `incident_${keyof Incident}`,
          FormDataEntryValue | number,
        ][]
      ) {
        const tokens = k.split("_");

        const k1 = tokens.shift() as keyof Report;

        const k2 = tokens.shift() as (
          | keyof Insurance
          | keyof Item
          | keyof Incident
        );

        if (typeof v != "string") {
          if (k == "item_image") {
            v = "data:image/jpg;base64, " +
              btoa(
                new Uint8Array(await (v as File).arrayBuffer()).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  "",
                ),
              );
          } else {
            return new Response(`"${k}" no es una cadena de caracteres.`, {
              status: 400,
            });
          }
        }

        if (!k2) {
          json[k1] = v;

          continue;
        }

        if (k1 == "id") {
          continue;
        }

        if (k == "insurance_number") {
          v = Number.parseInt(v);
        } else if (k == "incident_cost") {
          v = Number.parseFloat(v);
        } else if (k == "incident_when") {
          v = Date.parse(v as string);
        } else if (k == "insurance_expiration") {
          v = Date.parse(v as string);
        }

        json[k1] = {
          ...(json[k1 as keyof typeof json] as {
            [K in keyof typeof json]: (typeof json)[K] extends object ? K
              : undefined;
          }[keyof typeof json] ?? {}),
          [k2]: v,
        };
      }

      return await fetch(new URL(pathname, origin), {
        body: JSON.stringify(json),
        method: "PUT",
      });
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  },

  async PUT(req, ctx) {
    try {
      let json: Report;

      try {
        json = await req.json();
      } catch (e) {
        return new Response(e.message, { status: 400 });
      }

      if (!json) {
        return new Response("Cannot be null.", { status: 400 });
      }

      let { id, incident, item, insurance } = json;
      const { type } = incident;

      Object.entries({ id, incident, item, insurance })
        .forEach(
          ([k, v]) => {
            if (typeof v == undefined || v === null) {
              return new Response(`"${k}" cannot be null.`, { status: 400 });
            }
          },
        );

      if (ctx.params.id) {
        id = ctx.params.id;
      }

      id ??= Array.from(
        { length: Report.ID.Length },
        () => HEX[Math.floor(Math.random() * 100) % HEX.length],
      ).join("");

      if (!(typeof id == "string" && Report.ID.Regex.test(id))) {
        return new Response(
          "El ID debe ser una combinación de 24 caracteres hexadecimales.",
          {
            status: 400,
          },
        );
      }

      if (
        !(typeof type == "string" &&
          Object.values(Incident.Type).includes(type))
      ) {
        return new Response("Tipo de incidente no válido.", {
          status: 400,
        });
      }

      {
        let { name, image, desc } = item ?? {};

        if (!(typeof name == "string" && name.trim())) {
          return new Response("El objeto debe tener un nombre.", {
            status: 400,
          });
        }

        name = name.trim();

        if (
          image && !(typeof image == "string" &&
            /^data:image\/((jp(e)?g)|png);base64, ?(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}={2})$/
              .test(image))
        ) {
          return new Response("La imagen debe ser una data URI válido.", {
            status: 400,
          });
        }

        if (type != Incident.Type.Theft) {
          desc = undefined;
        }

        if (typeof desc == "string" && !desc.trim()) {
          return new Response("El objeto debe tener una descripción.", {
            status: 400,
          });
        }

        item = { name, image, desc };
      }

      {
        let { type, what, how, when, where, cause, cost } = incident ?? {};

        if (
          !(typeof type == "string" &&
            Object.values(Incident.Type).includes(type))
        ) {
          return new Response("Tipo de incidente no válido.", {
            status: 400,
          });
        }

        if (type == Incident.Type.Theft) {
          cause = undefined;
        } else {
          if (!(typeof cause == "string" && cause.trim())) {
            return new Response("La causa de la rotura es inválida.", {
              status: 400,
            });
          }

          cause = cause.trim();
        }

        if (!(typeof what == "string" && what.trim())) {
          return new Response("La descripción de la incidencia es inválida.", {
            status: 400,
          });
        }

        what = what.trim();

        if (!(typeof how == "string" && how.trim())) {
          return new Response("Los detalles del suceso son inválidos.", {
            status: 400,
          });
        }

        how = how.trim();

        if (!(typeof when == "number" && when >= 0)) {
          return new Response("La fecha de la incidencia es inválida.", {
            status: 400,
          });
        }

        if (!(typeof where == "string" && where.trim())) {
          return new Response("La ubicación de la incidencia es inválida.", {
            status: 400,
          });
        }

        where = where.trim();

        if (!(typeof cost == "number" && cost >= 0)) {
          return new Response("El costo de la incidencia es inválido.", {
            status: 400,
          });
        }

        cost = Math.floor(cost * 100) / 100;

        incident = { type, what, how, when, where, cost, cause };
      }

      {
        let { number, expiration, phone, id, coverage } = insurance ?? {};

        if (!(typeof number == "number" && number >= 0)) {
          return new Response("El número de asegurado es inválido.", {
            status: 400,
          });
        }

        if (!(typeof expiration == "number" && expiration >= 0)) {
          return new Response("La fecha de vencimiento es inválida.", {
            status: 400,
          });
        }

        if (!(typeof phone == "string" && /^\d{9}$/.test(phone.trim()))) {
          return new Response("El número de teléfono es inválido.", {
            status: 400,
          });
        }

        phone = phone.trim();

        if (!Insurance.ID.is(id)) {
          return new Response("El DNI del asegurado es inválido.", {
            status: 400,
          });
        }

        if (!Object.values(Insurance.Coverage).some((x) => x == coverage)) {
          return new Response("Cobertura de seguro inválida.", { status: 400 });
        }

        insurance = { number, expiration, phone, id, coverage };
      }

      json = { id, incident, item, insurance };
      DOCS.push(json);

      await Deno.writeTextFile(FILENAME, JSON.stringify(DOCS, null, 4));

      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  },
};
