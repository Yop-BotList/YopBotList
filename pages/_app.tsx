import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
        <Head>
            <title>YopBot List</title>
            <link rel="icon" href="https://cdn.discordapp.com/icons/782644006190055486/abebf32ccdda97f12f9d4aaaa0e064fc.webp" />
        </Head>
        <div className="main">
            <Component {...pageProps} />
        </div>
        <footer>
            <div className="start">
                <p>YopBot List - 2021</p>
            </div>
            <div className="end">
                <p>Notre <a href="https://discord.gg/3dQeTg9Vz3" target="_blank">Discord</a></p>
            </div>
        </footer>
      </>
  )
}
