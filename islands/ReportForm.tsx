import { computed, effect, useSignal } from "@preact/signals";
import IconChevronUp from "tabler-icons/chevron-up.tsx";
import IconChevronDown from "tabler-icons/chevron-down.tsx";
import Incident from "types/Incident.ts";
import { useEffect, useRef } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import IconX from "tabler-icons/x.tsx";
import Insurance from "types/Insurance.ts";
import IconPhoto from "tabler-icons/photo.tsx";
import { SignalLike } from "$fresh/src/types.ts";

export default function () {
  const LABEL_CLASS =
    "block text-sm font-medium leading-6 text-slate-900" as const;

  const INPUT_CLASS =
    "block w-full rounded-md border-0 px-2 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 !empty:ring-slate-600 invalid:ring-red-600 out-of-range:ring-red-600 sm:text-sm sm:leading-6" as const;

  const TEXTAREA_STYLE = {
    "focus:-webkit-box-shadow": "none",
    "focus:-moz-box-shadow": "none",
  } as const;

  const TEXTAREA_CLASS = INPUT_CLASS + " resize";

  function GET_CHILDREN(e: Element | null): Element[] {
    if (!e) {
      return [];
    }

    return [
      e,
      ...Array.from(e.children ?? []).flatMap((x) => GET_CHILDREN(x)),
    ];
  }

  const ON_DRAG_ENTER = (e: Event) => {
    e.preventDefault();

    const zone = dropZoneRef.current;
    if (!zone) {
      return;
    }

    const children = GET_CHILDREN(zone);

    const classes = [
      "!border-cyan-500",
      "!bg-cyan-50",
    ] as const;

    zone.classList.add(...classes.filter((c) => !zone.classList.contains(c)));
    children.forEach((x) =>
      x.classList.add(
        ...classes.slice(1).filter((c) => !x.classList.contains(c)),
      )
    );
  };

  const ON_DRAG_LEAVE = (e: Event) => {
    e.preventDefault();

    const zone = dropZoneRef.current;
    if (!zone) {
      return;
    }

    const children = GET_CHILDREN(zone);

    const classes = [
      "!border-cyan-500",
      "!bg-cyan-50",
    ] as const;

    zone.classList.remove(...classes);
    children.forEach((x) => x.classList.remove(...classes.slice(1)));
  };

  const ON_DRAG_OVER = (e: Event) => ON_DRAG_ENTER(e);

  const FILE_TO_IMAGE = (f: File | null | undefined) => {
    if (!f) {
      return item.image.value = undefined;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      item.image.value = e.target?.result as string;
    };

    reader.readAsDataURL(f);
  };

  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let children: ReturnType<typeof GET_CHILDREN> | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;

    const f = () => {
      const zone = dropZoneRef.current;

      if (!zone) {
        return;
      }

      if (interval !== undefined) {
        clearInterval(interval);
      }

      children = GET_CHILDREN(zone);

      children.forEach((x) => {
        x.addEventListener("dragenter", ON_DRAG_ENTER);
        x.addEventListener("dragleave", ON_DRAG_LEAVE);
        x.addEventListener("dragover", ON_DRAG_OVER);
      });
    };

    f();

    if (!children) {
      interval = setInterval(f, 10);
    }

    globalThis.addEventListener("resize", f);
    globalThis.addEventListener("scroll", f);

    return () => {
      children?.forEach((x) => {
        x.removeEventListener("dragenter", ON_DRAG_ENTER);
        x.removeEventListener("dragleave", ON_DRAG_LEAVE);
        x.removeEventListener("dragover", ON_DRAG_OVER);

        globalThis.removeEventListener("resize", f);
        globalThis.removeEventListener("scroll", f);

        if (interval !== undefined) {
          clearInterval(interval);
        }
      });
    };
  }, []);

  const toggled = { type: useSignal(false), coverage: useSignal(false) };

  const typeRef = {
    main: useRef<HTMLButtonElement>(null),
    options: useRef<HTMLDivElement>(null),
  };

  const coverageRef = {
    main: useRef<HTMLButtonElement>(null),
    options: useRef<HTMLDivElement>(null),
  };

  const moveType = () => {
    if (!toggled.type.value) {
      return;
    }

    if (Object.values(typeRef).some((x) => !x.current)) {
      return;
    }

    const { top, left, height } = typeRef.main.current!
      .getBoundingClientRect();

    typeRef.options.current!.style.left = `${left + 8}px`;
    typeRef.options.current!.style.top = `${top + height + 16}px`;
  };

  const moveCoverage = () => {
    if (!toggled.coverage.value) {
      return;
    }

    if (Object.values(coverageRef).some((x) => !x.current)) {
      return;
    }

    const { top, left, height } = coverageRef.main.current!
      .getBoundingClientRect();

    coverageRef.options.current!.style.left = `${left + 8}px`;
    coverageRef.options.current!.style.top = `${top + height + 16}px`;
  };

  useEffect(() => {
    const f = () => {
      moveCoverage();
      moveType();
    };

    f();

    globalThis.addEventListener("resize", f);
    globalThis.addEventListener("scroll", f);

    return () => {
      globalThis.removeEventListener("resize", f);
      globalThis.removeEventListener("scroll", f);
    };
  }, []);

  effect(moveType);
  effect(moveCoverage);

  const fileRef = useRef<HTMLInputElement>(null);

  const incident = {
    type: useSignal<Incident.Type | undefined>(undefined),
    cost: useSignal<string | undefined>(undefined),
    cause: useSignal<string | undefined>(undefined),
    desc: useSignal<string | undefined>(undefined),
    what: useSignal<string | undefined>(undefined),
    how: useSignal<string | undefined>(undefined),
    where: useSignal<string | undefined>(undefined),
    when: useSignal<string | undefined>(undefined),
  };

  const item = {
    name: useSignal<string | undefined>(undefined),
    image: useSignal<string | undefined>(undefined),
  };

  const insurance = {
    coverage: useSignal<Insurance.Coverage | undefined>(undefined),
    expiration: useSignal<string | undefined>(undefined),
    number: useSignal<number | undefined>(undefined),
    phone: useSignal<string | undefined>(undefined),
    id: useSignal<string | undefined>(undefined),
  };

  const labels = computed(() => {
    switch (incident.type.value) {
      case Incident.Type.Breakage:
        return {
          when: "Fecha y hora de la rotura",
          what: "Resumen de la rotura",
          how: "Detalles de la rotura",
        };

      case Incident.Type.Fire:
        return {
          when: "Fecha y hora del incendio",
          what: "Resumen del incendio",
          how: "Detalles del incendio",
        };

      case Incident.Type.Theft:
        return {
          when: "Fecha y hora del robo",
          what: "Resumen del robo",
          how: "Detalles del robo",
        };

      case Incident.Type.Flood:
        return {
          when: "Fecha y hora de la inundación",
          what: "Resumen de la inundación",
          how: "Detalles de la inundación",
        };

      default:
        return {
          when: "Fecha y hora de la incidencia",
          what: "Resumen de la incidencia",
          how: "Detalles del suceso",
        };
    }
  });

  const disabled = computed(() => {
    switch (incident.type.value) {
      case Incident.Type.Breakage:
      case Incident.Type.Fire:
      case Incident.Type.Flood: {
        if (!incident.cause.value?.trim()) {
          return true;
        }

        break;
      }

      case Incident.Type.Theft: {
        if (!incident.desc.value?.trim()) {
          return true;
        } else if (!incident.where.value?.trim()) {
          return true;
        }

        break;
      }

      default: {
        return true;
      }
    }

    const i = { ...incident };
    (["cause", "desc", "where"] as (keyof typeof i)[]).forEach((x) => {
      if (i[x]) {
        delete i[x];
      }
    });

    return [item, insurance, i].flatMap((x) => Object.values(x)).some(
      (x) => {
        const v = x.value;
        if (v === undefined || v === null) {
          return true;
        }

        if (typeof v == "string" && v.trim() == "") {
          return true;
        }

        return false;
      },
    );
  });

  useEffect(() => {
    const signals = { incident, item, insurance };

    [
      ...document.querySelectorAll("input"),
      ...document.querySelectorAll("textarea"),
    ].forEach((x) => {
      const { name } = x;

      if (!name) {
        return;
      }

      const [k1, k2, ..._] = name.split("_");
      if (!(k1 == "item" || k1 == "incident" || k1 == "insurance")) {
        return;
      }

      if (k1 == "item" && k2 == "image") {
        FILE_TO_IMAGE((x as HTMLInputElement).files?.[0] ?? null);
      } else {
        (signals[k1 as keyof typeof signals][
          k2 as keyof (typeof signals)[keyof typeof signals]
          // deno-lint-ignore no-explicit-any
        ] as SignalLike<any>).value = k2 == "number"
          ? (x as HTMLInputElement).valueAsNumber
          : x.value;
      }
    });
  }, []);

  return (
    <form
      action="javascript:void(0);"
      method="POST"
      onSubmit={(e: SubmitEvent) => {
        e.stopImmediatePropagation();
        e.preventDefault();

        if (disabled.value) {
          return;
        }

        const data = new FormData(e.target as HTMLFormElement);

        data.append("insurance_coverage", insurance.coverage.value ?? "");
        data.append("incident_type", incident.type.value ?? "");
        data.append("item_image", item.image.value ?? "");

        fetch("/api", {
          method: "POST",
          body: data,
        }).then(async (r) => {
          if (!r.ok) {
            try {
              throw new Error(await r.text());
            } catch (e) {
              console.error(e);

              throw e;
            }
          }

          try {
            globalThis.location.href = new URL(
              `/reports/${(await r.json()).id}`,
              globalThis.location.origin,
            ).toString();
          } catch (e) {
            console.error(e);

            throw new Error("No se pudo abrir el reporte: " + e.message);
          }
        }).catch((e) => alert(e.message));
      }}
      className="flex flex-col flex-1 items-baseline w-full h-full"
    >
      <div className="flex flex-row items-center justify-items-stretch justify-evenly w-full">
        <div className="flex flex-row items-center w-full">
          <button
            ref={typeRef.main}
            type="button"
            className="px-2 py-3 flex flex-row items-center justify-items-center gap-2 bg-slate-300 text-slate-800 rounded-2xl"
            onClick={() => toggled.type.value = !toggled.type.value}
          >
            <span
              style={{ width: `${"Tipo de incidencia".length}ch` }}
            >
              {incident.type.value == undefined
                ? <i>Tipo de incidencia</i>
                : incident.type.value}
            </span>

            {toggled.type.value
              ? <IconChevronUp size={16} />
              : <IconChevronDown size={16} />}
          </button>
        </div>

        <button
          disabled={disabled}
          type="submit"
          className="disabled:bg-gray-500/50 disabled:cursor-not-allowed px-2 py-3 flex flex-row items-center justify-items-center gap-2 bg-slate-700 text-slate-100 rounded-2xl"
        >
          Tramitar
        </button>
      </div>

      <div
        ref={typeRef.options}
        className={`${
          toggled.type.value ? "" : "hidden "
        }fixed px-2 py-3 flex flex-col items-center justify-items-center divide-slate-400 divide-y bg-slate-300 text-slate-800 rounded-2xl w-[${"Tipo de incidencia".length}ch]`}
      >
        {Object.values(Incident.Type).map((x) => (
          <button
            style={{ width: `${"Tipo de incidencia".length}ch` }}
            className="!last:pb-0 !first:pt-0 py-2"
            type="button"
            onClick={() => {
              incident.type.value = x;
              toggled.type.value = false;
            }}
          >
            {x}
          </button>
        ))}
      </div>

      <div className="pt-12 grid grid-cols-2 items-start justify-items-stretch gap-12">
        <div className="grid grid-cols-1 items-start justify-items-stretch gap-12">
          <div className="grid grid-cols-1 items-baseline justify-items-start gap-10 border-2 border-slate-800 p-4 rounded-xl">
            <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
              <label for="item_name" class={LABEL_CLASS}>
                Nombre del objeto
              </label>

              <input
                required
                name="item_name"
                class={INPUT_CLASS}
                minLength={1}
                onInput={(e) =>
                  item.name.value = (e.target as HTMLInputElement).value}
              />
            </div>

            <div className="grid grid-cols-1 items-baseline justify-items-start gap-4">
              <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                <label for="item_image" class={LABEL_CLASS}>
                  Fotografía del objeto
                </label>

                {item.image.value && (
                  <div className="flex flex-col flex-1 items-center relative w-[280px] h-[190px]">
                    {item.image.value && (
                      <button
                        type="button"
                        class="absolute -right-1.5 -top-1.5 rounded-full bg-red-500"
                        onClick={() => {
                          if (fileRef.current) {
                            fileRef.current.value = "";
                          }

                          item.image.value = undefined;
                        }}
                      >
                        {<IconX size={24} class="text-white" />}
                      </button>
                    )}

                    <a
                      href={(() => {
                        const i = item.image.value;

                        const byteString = atob(i.split(",")[1]);

                        const mimeString =
                          i.split(",")[0].split(":")[1].split(";")[0];

                        const ab = new ArrayBuffer(byteString.length);

                        const ia = new Uint8Array(ab);

                        for (let i = 0; i < byteString.length; i++) {
                          ia[i] = byteString.charCodeAt(i);
                        }

                        const blob = new Blob([ab], { type: mimeString });

                        return URL.createObjectURL(blob);
                      })()}
                      target="_blank"
                    >
                      <img
                        class="rounded-lg hover:cursor-pointer"
                        src={item.image}
                      />
                    </a>
                  </div>
                )}

                <div
                  ref={dropZoneRef}
                  className={`${
                    item.image.value ? "hidden " : ""
                  }flex justify-center rounded-lg border border-dashed border-red-500 px-6 py-10`}
                  onDragEnter={ON_DRAG_ENTER}
                  onDragLeave={ON_DRAG_LEAVE}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const f = fileRef.current;
                    if (!f) {
                      e.preventDefault();

                      return;
                    }

                    f.files = e.dataTransfer?.files ?? null;

                    f.dispatchEvent(new Event("input"));

                    e.preventDefault();
                  }}
                >
                  <div className="text-center">
                    <IconPhoto
                      className="mx-auto h-12 w-12 text-slate-300"
                      aria-hidden="true"
                    />

                    <div className="mt-4 flex text-sm leading-6 text-slate-600">
                      <label
                        htmlFor="item_image"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-slate-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-700 focus-within:ring-offset-2 hover:text-slate-600"
                      >
                        <span>Sube un archivo</span>

                        <input
                          className="sr-only"
                          required
                          ref={fileRef}
                          accept="image/png, image/jpeg"
                          type="file"
                          id="item_image"
                          name="item_image"
                          onInput={(e) => {
                            const f = (e.target as HTMLInputElement).files
                              ?.[0];

                            FILE_TO_IMAGE(f);
                          }}
                        />
                      </label>
                      <p className="pl-1">or arrastra y suelta</p>
                    </div>
                    <p className="text-xs leading-5 text-slate-600">
                      PNG o JPG
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 items-baseline justify-items-start gap-4 border-2 border-slate-800 p-4 rounded-xl">
            <div className="grid grid-cols-1 items-center justify-items-start gap-10">
              <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                <label for="insurance_number" class={LABEL_CLASS}>
                  Número de póliza
                </label>

                <input
                  class={INPUT_CLASS}
                  required
                  type="number"
                  name="insurance_number"
                  min={0}
                  onInput={(e) =>
                    insurance.number.value = parseInt(
                      (e.target as HTMLInputElement).value,
                    )}
                />
              </div>

              <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                <label for="insurance_phone" class={LABEL_CLASS}>
                  Número de teléfono
                </label>

                <input
                  class={INPUT_CLASS}
                  required
                  type="tel"
                  pattern={Insurance.Phone.Regex.source}
                  name="insurance_phone"
                  min={0}
                  onInput={(e) =>
                    insurance.phone.value =
                      (e.target as HTMLInputElement).value}
                />
              </div>

              <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                <label for="insurance_phone" class={LABEL_CLASS}>
                  DNI
                </label>

                <input
                  class={INPUT_CLASS}
                  required
                  pattern={Insurance.ID.Regex.source}
                  name="insurance_id"
                  min={0}
                  onInput={(e) =>
                    insurance.id.value = (e.target as HTMLInputElement).value}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 items-stretch justify-items-start gap-10">
              <button
                ref={coverageRef.main}
                type="button"
                className="px-2 py-3 flex flex-row items-center justify-items-center gap-2 bg-slate-300 text-slate-800 rounded-2xl"
                onClick={() => toggled.coverage.value = !toggled.coverage.value}
              >
                <span
                  style={{ width: `${"Cobertura ampliada".length}ch` }}
                >
                  {insurance.coverage.value == undefined
                    ? <i>Cobertura</i>
                    : `Cobertura ${
                      insurance.coverage.value.toLocaleLowerCase("es-ES")
                    }`}
                </span>

                {toggled.coverage.value
                  ? <IconChevronUp size={16} />
                  : <IconChevronDown size={16} />}
              </button>

              <div
                ref={coverageRef.options}
                className={`${
                  toggled.coverage.value ? "" : "hidden "
                }fixed z-50 px-2 py-3 flex flex-col items-center justify-items-center divide-slate-400 divide-y bg-slate-300 text-slate-800 rounded-2xl w-[${"Cobertura ampliada".length}ch]`}
              >
                {Object.values(Insurance.Coverage).map((x) => (
                  <button
                    style={{ width: `${"Cobertura ampliada".length}ch` }}
                    className="!last:pb-0 !first:pt-0 py-2"
                    type="button"
                    onClick={() => {
                      insurance.coverage.value = x;
                      toggled.coverage.value = false;
                    }}
                  >
                    {x}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                <label for="insurance_expiration" class={LABEL_CLASS}>
                  Expiración de la póliza
                </label>

                <input
                  class={INPUT_CLASS}
                  required
                  type="date"
                  name="insurance_expiration"
                  min={0}
                  onChange={(e) =>
                    insurance.expiration.value =
                      (e.target as HTMLInputElement).value}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            "-webkit-box-sizing": "border-box",
            "-moz-box-sizing": "border-box",
          }}
          className={`relative w-full overflow-visible grid ${
            incident.type.value ? "grid-cols-2" : "grid-cols-1"
          } items-baseline justify-items-start gap-4 border-box border-2 border-slate-800 p-4 rounded-xl`}
        >
          <div className="relative w-full overflow-visible grid grid-cols-1 items-center justify-items-start gap-10 border-box">
            <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
              <label for="incident_when" class={LABEL_CLASS}>
                {labels.value.when}
              </label>

              <input
                class={INPUT_CLASS}
                required
                type="datetime-local"
                name="incident_when"
                minLength={1}
                onChange={(e) =>
                  incident.when.value = (e.target as HTMLInputElement).value}
              />
            </div>

            <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
              <label for="incident_what" class={LABEL_CLASS}>
                {labels.value.what}
              </label>

              <textarea
                cols={50}
                style={TEXTAREA_STYLE}
                class={TEXTAREA_CLASS}
                required
                name="incident_what"
                minLength={1}
                onInput={(e) =>
                  incident.what.value = (e.target as HTMLInputElement).value}
              />
            </div>

            <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
              <label for="incident_how" class={LABEL_CLASS}>
                {labels.value.how}
              </label>

              <textarea
                cols={50}
                style={TEXTAREA_STYLE}
                class={TEXTAREA_CLASS}
                required
                name="incident_how"
                minLength={1}
                onInput={(e) =>
                  incident.how.value = (e.target as HTMLInputElement).value}
              />
            </div>
          </div>

          {incident.type.value &&
            (
              <div className="w-full relative overflow-visible grid grid-cols-1 items-center justify-items-start gap-10">
                {incident.type.value == Incident.Type.Breakage && (
                  <>
                    <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                      <label for="incident_cause" class={LABEL_CLASS}>
                        Causa de la rotura
                      </label>

                      <textarea
                        cols={50}
                        style={TEXTAREA_STYLE}
                        class={TEXTAREA_CLASS}
                        required
                        name="incident_cause"
                        minLength={1}
                        value={incident.cause}
                        onInput={(e) =>
                          incident.cause.value =
                            (e.target as HTMLInputElement).value}
                      />
                    </div>

                    <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                      <label for="incident_cost" class={LABEL_CLASS}>
                        Coste estimado de la reparacion
                      </label>

                      <div className="relative">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span class="text-gray-500 sm:text-sm">€</span>
                        </div>

                        <input
                          placeholder="0.00"
                          pattern={Incident.Cost.Regex.source}
                          class={INPUT_CLASS + " !pl-7"}
                          required
                          name="incident_cost"
                          minLength={1}
                          value={incident.cost}
                          onInput={(e) =>
                            incident.cost.value =
                              (e.target as HTMLInputElement).value}
                        />
                      </div>
                    </div>
                  </>
                )}

                {incident.type.value == Incident.Type.Flood && (
                  <>
                    <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                      <label for="incident_cause" class={LABEL_CLASS}>
                        Causa de la inundación
                      </label>

                      <textarea
                        cols={50}
                        style={TEXTAREA_STYLE}
                        class={TEXTAREA_CLASS}
                        required
                        name="incident_cause"
                        minLength={1}
                        value={incident.cause}
                        onInput={(e) =>
                          incident.cause.value =
                            (e.target as HTMLInputElement).value}
                      />
                    </div>

                    <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                      <label for="incident_cost" class={LABEL_CLASS}>
                        Coste estimado de los daños
                      </label>

                      <div className="relative">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span class="text-gray-500 sm:text-sm">€</span>
                        </div>

                        <input
                          placeholder="0.00"
                          pattern={Incident.Cost.Regex.source}
                          class={INPUT_CLASS + " !pl-7"}
                          required
                          name="incident_cost"
                          minLength={1}
                          value={incident.cost}
                          onInput={(e) =>
                            incident.cost.value =
                              (e.target as HTMLInputElement).value}
                        />
                      </div>
                    </div>
                  </>
                )}

                {incident.type.value == Incident.Type.Fire && (
                  <>
                    <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                      <label for="incident_cause" class={LABEL_CLASS}>
                        Causa del incendio
                      </label>

                      <textarea
                        cols={50}
                        style={TEXTAREA_STYLE}
                        class={TEXTAREA_CLASS}
                        required
                        name="incident_cause"
                        minLength={1}
                        value={incident.cause}
                        onInput={(e) =>
                          incident.cause.value =
                            (e.target as HTMLInputElement).value}
                      />
                    </div>

                    <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                      <label for="incident_cost" class={LABEL_CLASS}>
                        Coste estimado de los daños
                      </label>

                      <div className="relative">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span class="text-gray-500 sm:text-sm">€</span>
                        </div>

                        <input
                          placeholder="0.00"
                          pattern={Incident.Cost.Regex.source}
                          class={INPUT_CLASS + " !pl-7"}
                          required
                          name="incident_cost"
                          minLength={1}
                          value={incident.cost}
                          onInput={(e) =>
                            incident.cost.value =
                              (e.target as HTMLInputElement).value}
                        />
                      </div>
                    </div>
                  </>
                )}

                {incident.type.value == Incident.Type.Theft && (
                  <>
                    <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                      <label for="incident_desc" class={LABEL_CLASS}>
                        Descripción del objeto robado
                      </label>

                      <textarea
                        cols={50}
                        style={TEXTAREA_STYLE}
                        class={TEXTAREA_CLASS}
                        required
                        name="incident_desc"
                        minLength={1}
                        value={incident.desc}
                        onInput={(e) =>
                          incident.desc.value =
                            (e.target as HTMLInputElement).value}
                      />
                    </div>

                    <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                      <label for="incident_where" class={LABEL_CLASS}>
                        Lugar del robo
                      </label>

                      <textarea
                        cols={50}
                        style={TEXTAREA_STYLE}
                        class={TEXTAREA_CLASS}
                        required
                        name="incident_where"
                        minLength={1}
                        value={incident.where}
                        onInput={(e) =>
                          incident.where.value =
                            (e.target as HTMLInputElement).value}
                      />
                    </div>

                    <div className="grid grid-cols-1 items-baseline justify-items-start gap-1.5">
                      <label for="incident_cost" class={LABEL_CLASS}>
                        Coste estimado de los bienes robados
                      </label>

                      <div className="relative">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span class="text-gray-500 sm:text-sm">€</span>
                        </div>

                        <input
                          placeholder="0.00"
                          pattern={Incident.Cost.Regex.source}
                          class={INPUT_CLASS + " !pl-7"}
                          required
                          name="incident_cost"
                          minLength={1}
                          value={incident.cost}
                          onInput={(e) =>
                            incident.cost.value =
                              (e.target as HTMLInputElement).value}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
        </div>
      </div>
    </form>
  );
}
