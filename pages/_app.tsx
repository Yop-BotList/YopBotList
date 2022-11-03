import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <>
          <Head>
              <title>YopBot List</title>
          </Head>
          <div className="main">
              <Component {...pageProps} />
          </div>
      </>
  )
}
