import { computed, effect, useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import IconMessageChatbot from "tabler-icons/message-chatbot.tsx";
import IconSend from "tabler-icons/send.tsx";
import IconExclamationCircle from "tabler-icons/exclamation-circle.tsx";

export default function Chat({ init }: { init?: string }) {
  let interval: ReturnType<typeof setInterval> | undefined;
  const ref = {
    toggle: useRef<HTMLButtonElement>(null),
    chat: useRef<HTMLDivElement>(null),
    input: useRef<HTMLTextAreaElement>(null),
  };

  const messages = useSignal<{ message: string; user?: boolean }[]>([]);
  const prevMessages = useSignal(messages.value);

  const current = useSignal("");

  const notification = useSignal(!!init);
  const show = useSignal(false);
  const responding = useSignal(false);

  const scroll = () => {
    ref.chat.current?.scrollTo({
      top: ref.chat.current.scrollHeight,
      behavior: "smooth",
    });

    ref.chat.current?.firstElementChild?.scrollTo({
      top: ref.chat.current.firstElementChild.scrollHeight,
      behavior: "smooth",
    });
  };

  effect(() => {
    if (messages.value != prevMessages.value) {
      prevMessages.value = messages.value;
      setTimeout(scroll, 100);
    }
  });

  effect(() => {
    if (show.value || responding.value) setTimeout(scroll, 100);
  });

  effect(() => {
    if (show.value) {
      setTimeout(() => {
        (document?.activeElement as HTMLElement | null)?.blur();
        ref.input.current?.focus();
      }, 100);
    }
  });

  const send = (
    message: string | undefined,
    user?: boolean,
    timeout?: number,
  ) => {
    if (!message?.trim()) {
      return;
    }

    const pos = () => {
      scroll();
      if (show.value) {
        (document?.activeElement as HTMLElement | null)?.blur();
        ref.input.current?.focus();
      }
    };

    const add = () => {
      messages.value = [...messages.value, { message, user }];

      if (!(notification.value && show.value)) {
        notification.value = true;
      }

      pos();
    };

    if (!timeout) {
      return add();
    }

    responding.value = true;
    setTimeout(scroll, 100);

    setTimeout(() => {
      responding.value = false;
      add();
    }, timeout);
  };

  effect(() => {
    if (show.value && notification.value) {
      notification.value = false;
    }
  });

  const setPos = () => {
    if (!show.value) {
      if (typeof interval != "undefined") {
        clearInterval(interval);
        interval = undefined;
      }

      return;
    }

    const { toggle, chat } = ref;

    if (!(toggle.current && chat.current)) {
      return;
    }

    clearInterval(interval);
    interval = undefined;

    const { top, x, width, height } = toggle.current.getBoundingClientRect();

    chat.current.style.bottom = `${
      globalThis.innerHeight - top + height / 2
    }px`;
    chat.current.style.right = `${globalThis.innerWidth - x - width}px`;
  };

  useEffect(() => {
    send(init);

    const closeChat = () => show.value = false;
    const reopenChat = () => {
      if (!show.value) {
        return;
      }

      closeChat();
      show.value = true;
    };

    globalThis.addEventListener("scroll", closeChat);
    globalThis.addEventListener("resize", reopenChat);

    return () => {
      globalThis.removeEventListener("scroll", closeChat),
        globalThis.removeEventListener("resize", reopenChat);
    };
  }, []);

  effect(() => {
    if (show.value) {
      interval = setInterval(setPos, 10);
    }

    setPos();
  });

  return (
    <>
      <div
        ref={ref.chat}
        className={`${
          show.value ? "" : "hidden "
        }shadow-md fixed z-50 px-2 py-3 grid grid-cols-1 gap-3 items-center justify-items-center rounded-xl bg-white`}
      >
        <div className="overflow-y-auto h-72 relative p-3">
          {messages.value.map(({ message, user }, i) => (
            <div
              key={`message_${i}`}
              className={`w-52 h-fit grid mb-2 ${
                user ? "justify-items-end" : "justify-items-start"
              }`}
            >
              <div
                dir={user ? "rtl" : "ltr"}
                className={`relative p-2 w-fit max-w-[75%] bg-opacity-90 rounded-lg shadow-xl ${
                  user
                    ? "bg-slate-100 text-slate-700 text-right"
                    : "bg-slate-700 text-slate-100"
                }`}
              >
                <p
                  key={`message_${i}_text`}
                  dir="ltr"
                  className="text-sm text-inherit"
                >
                  {message}
                </p>
              </div>
            </div>
          ))}

          {responding.value && (
            <div
              key={`message_responding`}
              className="w-52 h-fit grid mb-2 justify-items-start"
            >
              <div
                dir="ltr"
                className="relative p-2 w-fit max-w-[75%] bg-opacity-90 rounded-lg shadow-xl bg-slate-700 flex flex-row gap-x-1.5 items-baseline"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    class={`animate-bounce inline-flex rounded-full h-3 w-3 text-slate-100 [animation-duration:_1s] ${
                      i == 0
                        ? ""
                        : i == 1
                        ? "[animation-delay:_0.5s]"
                        : "[animation-delay:_1s]"
                    }`}
                  >
                    ●
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-grow flex-row px-2 gap-3">
          <textarea
            class="disabled:cursor-not-allowed resize-none outline-none"
            style={{
              "focus:-webkit-box-shadow": "none",
              "focus:-moz-box-shadow": "none",
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellcheck={false}
            ref={ref.input}
            disabled={responding}
            required
            minLength={1}
            name="message"
            placeholder="Escribe para hablar"
            onInput={() => current.value = ref.input.current?.value || ""}
            onKeyUp={(e: KeyboardEvent) => {
              if (e.key != "Enter") {
                return;
              }

              send(current.value, true);
              (e.target as HTMLInputElement).value = "";
              current.value = "";

              let timeout = Math.random() * 10;
              timeout = timeout < 0.5 ? 0.5 : timeout;
              if (timeout > 3) {
                timeout = 2 + timeout - Math.floor(timeout);
              }

              send(
                messages.value.reduce(
                    (acc, { user }) => acc + (user ? 1 : 0),
                    0,
                  ) > 1
                  ? "Sigue intentándolo..."
                  : "Soy un chat de prueba, no te puedo contestar.",
                false,
                timeout * 1000,
              );
            }}
          />

          <button
            class="disabled:text-gray-500 disabled:cursor-not-allowed text-slate-700"
            onClick={() =>
              ref.input.current?.dispatchEvent(
                new KeyboardEvent("keyup", { key: "Enter" }),
              )}
            disabled={computed(() => !current.value?.trim().length)}
          >
            <IconSend size={24} class="text-inherit" />
          </button>
        </div>
      </div>

      <button
        ref={ref.toggle}
        class="relative rounded-xl p-2 bg-slate-700"
        onClick={() => show.value = !show.value}
      >
        {notification.value && (
          <span class="absolute -right-1 -top-1">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75">
              </span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500">
              </span>
            </span>
          </span>
        )}

        <IconMessageChatbot size={32} class="text-slate-300" />
      </button>
    </>
  );
}
