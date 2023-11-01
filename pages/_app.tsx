import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from "next/head";
import { inject } from "@vercel/analytics";
import Script from "next/script";
import Image from "next/image";

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
            <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-R7B513HDVR"/>
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-R7B513HDVR', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
            <Head>
                <title>Yop BotList</title>
                <meta name="description" content="YopBot List est une liste de bots discord qui vous permet de trouver des bots discord de qualité." />
                <meta property="og:color" content="#f2ac34" />
            </Head>
            <div className="main">
                <Image src={"/yopbotlist.png"} alt="YopBot List" width={150} height={150} />
                <h1>
                    C'est la fin d'une aventure
                </h1>
                <p>
                    Après 3 ans à vos côtés, Yop BotList ferme ses portes et nous nous en allons vers de nouveaux horizons...
                </p>
                <p>
                    Merci à vous pour tout ce temps passé ensemble, merci à vous pour votre soutien et votre confiance ❤️
                </p>
                <h2>
                    FAQ
                </h2>
                <h3>
                    Pourquoi cette fermeture ?
                </h3>
                <p>
                    Nous avons décidé de fermer Yop BotList car depuis quelques mois l'activité a fortement diminuée, et nous souhaitons nous concentrer sur de nouveaux projets.
                </p>
                <h3>
                    Que va devenir le site ?
                </h3>
                <p>
                    Le site restera fermé, mais le code source restera néanmoins accessible sur <a href="https://github.com/Yop-BotList/YopBotList">GitHub</a>.
                </p>
                <h3>
                    Qu'adviendra-t-il de nos bots ?
                </h3>
                <p>
                    Vos bots resteront sur le serveur Discord jusqu'à ce que celui-ci soit supprimé.
                </p>
                <h3>
                    Qu'adviendra-t-il de nos données ?
                </h3>
                <p>
                    Vos données seront supprimées de nos serveurs dans les prochains jours.
                </p>
                <h3>
                    Après ça ?
                </h3>
                <p>
                    Vous le savez peut-être déjà, mais depuis quelques mois, nous travaillons sur un nouveau projet de plus grande ampleur dont la première version "officielle" a vu le jour en septembre !
                </p>
                <p style={{marginTop: "1.5em" }}>
                    Discord Analytics est un outil unique de statistiques pour bots Discord. Pour le moment compatible avec Discord.JS, Eris, JDA, Javacord, et Discord4J, il vous permettra d'obtenir différentes statistiques sur les serveurs, les utilisateurs, les interactions de votre robot et bien plus encore !
                </p>
                <div className={"buttons"}>
                    <a className={"button"} href={"https://discordanalytics.xyz"}>
                        <img src={"/discordanalytics.png"} alt={"Discord Analytics"} />
                        Site Web
                    </a>
                    <a className={"button"} href={"https://discordanalytics.xyz/go/support"}>
                        <img src={"/discord.png"} alt={"Serveur support"} />
                        Serveur Support
                    </a>
                </div>
                <p style={{marginTop: "1.5em"}}>
                    Encore une fois, merci à tous et en espérant vous retrouver sur Discord Analytics ! ❤️
                </p>
                <a href='https://ko-fi.com/P5P575I1D' target='_blank'><img height='50' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' alt='Buy Me a Coffee at ko-fi.com' /></a>
            </div>
        </>
    )
}
