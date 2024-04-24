import { type PageProps } from "$fresh/server.ts";
import ErrorMessage from "components/message/ErrorMessage.tsx";

export default function ({ error }: PageProps) {
  return <ErrorMessage code={500} message={(error as Error).message} />;
}
