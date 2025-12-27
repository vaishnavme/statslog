import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import AppLayout from "../components/layout/app-layout";
import fonts from "../styles/fonts";
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
    <div className={`${fonts.geistSans.variable} ${fonts.geistMono.variable}`}>
      {getLayout(<Component {...pageProps} />)}
    </div>
  );
}

export default App;
