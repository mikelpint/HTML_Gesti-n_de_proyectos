import IconClipboardList from "tabler-icons/clipboard-list.tsx";

const links = {
  "": "Inicio",
  new: "Crear parte",
  reports: "Mis partes",
};

export default function Header() {
  return (
    <header className="w-full h-fit bg-slate-700 text-neutral-50 flex flex-row items-center justify-items-stretch px-12 py-4 gap-8 rounded-b-xl">
      <div className="h-fit flex flex-row flex-1 gap-4 items-center justify-items-center">
        <IconClipboardList size={32} />

        <h1 className="italic text-xl font-bold">Partes App</h1>
      </div>

      <ul className="w-full h-fit flex-1 flex flex-row gap-4 items-center justify-items-center justify-end">
        {Object.entries(links).map(([href, text]) => (
          <a
            href={`/${href}`}
            class="underline-offset-4 aria-[current='page']:underline hover:italic text-lg font-semibold"
          >
            {text}
          </a>
        ))}
      </ul>
    </header>
  );
}
