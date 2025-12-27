import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import AppLayout from "../components/layout/app-layout";
import fonts from "../styles/fonts";
import { Toaster } from "@/components/ui/sonner";
import "../styles/globals.css";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <AppLayout>{page}</AppLayout>);

  return (
    <ThemeProvider enableSystem defaultTheme="dark" attribute="class">
      <div
        className={`${fonts.geistSans.variable} ${fonts.geistMono.variable}`}
      >
        {getLayout(<Component {...pageProps} />)}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
