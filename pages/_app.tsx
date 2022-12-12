import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from "next/head";
import { inject } from "@vercel/analytics";

export default function App({ Component, pageProps }: AppProps) {
    inject({
        beforeSend: (event) => {
            if (event.type === "pageview") {
                event.url = window.location.href;
            }
            return event;
        }
    });

    return (
        <>
            <Head>
                <title>YopBot List</title>
                <link rel="icon" href="/yopbot.png" />
                <meta name="description" content="YopBot List est une liste de bots discord qui vous permet de trouver des bots discord de qualité." />

                <meta property="og:title" content="YopBot List" />
                <meta property="og:description" content="YopBot List est une liste de bots discord qui vous permet de trouver des bots discord de qualité." />
                <meta property="og:image" content="/yopbot.png" />
                <meta property="og:url" content="https://www.yopbotlist.me" />
                <meta property="og:type" content="website" />
            </Head>
            <div className="main">
                <Component {...pageProps} />
            </div>
            <footer>
                <div className="start">
                    <p>YopBot List - 2020</p>
                </div>
                <div className="end">
                    <p>Notre <a href="https://discord.gg/HgDKy7FcVJ" target="_blank">Discord</a></p>
                </div>
            </footer>
        </>
    )
}
