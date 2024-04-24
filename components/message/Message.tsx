import { ComponentChildren, JSX, VNode } from "preact";

export default function Message(
  { banner, title = "", message, extend, children }: {
    banner?: JSX.Element;
    title?: string;
    message?: string;
    extend?: boolean;
    children?: ComponentChildren;
  },
) {
  return (
    <div
      className={`${
        extend
          ? "w-full h-full flex-1 flex-shrink-0 flex-nowrap"
          : "w-fit h-fit flex-shrink flex-wrap"
      } flex flex-col items-center justify-center justify-items-center bg-white p-8 rounded-lg shadow-lg break-words`}
    >
      <div className="inline-flex break-words w-fit h-fit items-center justify-center text-slate-700 mb-4">
        {banner}
      </div>

      <h1 className="w-full break-words text-4xl text-center font-bold text-slate-700 mb-4">
        {title}
      </h1>

      <p className="flex flex-wrap flex-shrink w-fit break-words text-center text-gray-600 mb-8">
        {message}
      </p>

      <div className="flex break-words w-full items-center justify-center justify-items-center text-gray-600">
        {children}
      </div>
    </div>
  );
}
