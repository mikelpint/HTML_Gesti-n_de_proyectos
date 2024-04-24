import ErrorMessage from "components/message/ErrorMessage.tsx";
import { type PageProps } from "$fresh/server.ts";

export default function Error404({ url }: PageProps) {
  return (
    <ErrorMessage
      code={404}
      message={"¡Vaya! La página que estabas buscando (" + url.pathname +
        ") no pudo ser encontrada."}
    />
  );
}
