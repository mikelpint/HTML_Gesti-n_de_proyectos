import { type PageProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import Header from "components/section/Header.tsx";
import Footer from "components/section/Footer.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html
      lang="es"
      style={{
        "-webkit-box-sizing": "border-box",
        "-moz-box-sizing": "border-box",
      }}
      className="overflow-visible items-center p-0 m-0 box-border min-w-full w-max h-full"
    >
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
          key="viewport"
        />

        <meta charset="utf-8" />
        <meta lang="es" key="lang" />

        <meta property="og:title" content="Partes App" key="title" />
        <meta name="description" content="Partes App" key="description" />
        <meta name="author" content="Fuxiladores" key="author" />

        <meta property="og:type" content="website" key="type" />

        <title>Partes App</title>

        <link
          rel="icon"
          type="image/x-icon"
          href={asset("/favicon.ico")}
          key="favicon"
        />

        <link
          rel="stylesheet"
          href={asset("/styles/fonts.css")}
          key="fonts"
        />

        <link rel="stylesheet" href={asset("/styles/styles.css")} />
      </Head>

      <body
        style={{
          "-webkit-box-sizing": "border-box",
          "-moz-box-sizing": "border-box",
        }}
        className="overflow-visible items-center flex-1 flex flex-col p-0 m-0 box-border min-w-full w-max h-full"
      >
        <Header />

        <main className="relative overflow-visible h-max place-content-center flex-1 flex flex-col shrink-0 flex-nowrap flex-grow items-center justify-items-center px-[10%] w-[80%] xl:pb-20 md:p-15 sm:py-10 py-5">
          <Component />
        </main>

        <Footer />
      </body>
    </html>
  );
}
