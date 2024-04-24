import IconPhone from "tabler-icons/phone.tsx";
import IconMail from "tabler-icons/mail.tsx";
import IconBrandFacebook from "tabler-icons/brand-facebook.tsx";
import IconBrandTwitter from "tabler-icons/brand-twitter.tsx";
import IconBrandInstagram from "tabler-icons/brand-instagram.tsx";

const SIZE = 24 as const;

export default function () {
  return (
    <footer className="w-full h-fit bg-slate-700 text-neutral-50 flex flex-row items-center justify-items-stretch px-12 py-4 gap-8 rounded-t-xl">
      <ul className="w-full h-fit flex-1 flex flex-row gap-3 items-center justify-items-center justify-end">
        <div className="w-full h-fit flex flex-row flex-1 gap-1.5 items-center justify-items-center">
          <IconPhone size={SIZE} />

          <p>+1 (555) 123-4567</p>
        </div>

        <div className="h-fit flex flex-row flex-1 gap-1.5 items-center justify-items-center">
          <IconMail size={SIZE} />

          <p>info@partesapp.com</p>
        </div>

        <div className="h-fit flex flex-row flex-1 gap-1.5 items-center justify-items-center">
          <a target="_blank" href="https://www.facebook.com/elxokass/">
            <IconBrandFacebook size={SIZE} />
          </a>

          <a target="_blank" href="https://twitter.com/elxokas">
            <IconBrandTwitter size={SIZE} />
          </a>

          <a target="_blank" href="https://www.instagram.com/elxokas/">
            <IconBrandInstagram size={SIZE} />
          </a>
        </div>
      </ul>

      <p className="justify-end">
        © 2024 Partes App. Todos los derechos reservados.
      </p>
    </footer>
  );
}
