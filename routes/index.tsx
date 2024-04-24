import { cloneElement, JSX } from "preact/compat";

const PARAS = {
  "Quiénes somos": (
    <p>
      Como empresa líder en el desarrollo de software para el sector financiero
      y asegurador, nos enfrentamos a un emocionante desafío: crear un sistema
      de toma de partes para incidentes en el hogar que marque un nuevo estándar
      en eficiencia y calidad.
    </p>
  ),
  "Objetivo": (
    <p>
      Nuestro objetivo es claro: proporcionar a los clientes de las aseguradoras
      una experiencia fluida y transparente al informar y gestionar reclamos
      desde sus dispositivos móviles. Con un enfoque en la optimización de
      costos y la entrega oportuna, estamos comprometidos a entregar un producto
      superior que no solo beneficie a nuestros clientes, sino que también
      consolide nuestra posición como líderes en un mercado altamente
      competitivo.
    </p>
  ),
} as const;

export default function () {
  return (
    <article className="w-min h-fit flex-shrink flex flex-col items-center justify-items gap-8">
      {Object.entries(PARAS).map((
        [title, text],
        i,
      ) =>
        [title, text, i % 2 ? "left" : "right", i % 2 ? "ltr" : "rtl"] as [
          string,
          JSX.Element,
          "left" | "right",
          "ltr" | "rtl",
        ]
      ).map((
        [title, text, orientation, dir],
        i,
      ) => (
        <section
          dir={dir}
          className={`relative w-full flex flex-col flex-shrink flex-grow-0 align-middle justify-items-${orientation} justify-${orientation} text-${orientation} justify-text-${orientation} gap-4 p-4 bg-gray-50 rounded-2xl`}
        >
          <h2
            className={`w-fit justify-${orientation} text-${orientation} font-semibold text-xl`}
          >
            {title}
          </h2>

          {cloneElement(text, {
            dir: "ltr",
            className:
              `text-${orientation} break-words indent-8 text-pretty min-w-96 w-1/3`,
          })}
        </section>
      ))}
    </article>
  );
}
