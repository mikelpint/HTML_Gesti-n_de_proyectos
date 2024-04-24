import Message from "components/message/Message.tsx";
import HomeMessage from "components/message/HomeMessage.tsx";

export default function ErrorMessage(
  { code, name, message, error, extend, nohome }:
    & ({
      code?: number;
      name?: string;
      message?: string;

      error?: never;
    } | { error: Error; code?: never; name?: never; message?: never })
    & {
      extend?: boolean;
      nohome?: boolean;
    },
) {
  let props;
  if (error) {
    props = { title: error.name, message: error.message };
  } else {
    props = {
      title: (code ?? "") + (code && name ? ": " : "") + (name ?? ""),
      message: message,
    };
  }

  return nohome ? <Message {...props} /> : <HomeMessage {...props} />;
}
