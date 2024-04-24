import Message from "components/message/Message.tsx";
import { JSX, VNode } from "preact";
import IconHome from "tabler-icons/home.tsx";

export default function LinkMessage(
  { link, icon, banner, title, message, extend }: {
    link: string;
    icon?: string | JSX.Element;
    banner?: JSX.Element;
    title?: string;
    message?: string;
    extend?: boolean | "true" | "false";
  },
) {
  return (
    <Message
      extend={extend}
      banner={banner}
      title={title}
      message={message}
    >
      <a href={link}>
        <button className="rounded-full">
          {icon}
        </button>
      </a>
    </Message>
  );
}
