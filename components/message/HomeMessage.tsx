import LinkMessage from "components/message/LinkMessage.tsx";
import IconHome from "tabler-icons/home.tsx";

export default function HomeMessage(
  { banner, icon, title, message, extend }:
    & Omit<Parameters<typeof LinkMessage>[0], "link">
    & { link?: never },
) {
  return (
    <LinkMessage
      banner={banner}
      title={title}
      icon={<IconHome size={32} class="text-slate-700" />}
      message={message}
      link="/"
      extend={extend}
    />
  );
}
