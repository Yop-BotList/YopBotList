import { GetServerSideProps } from "next";
import axios from "axios";
import NavBar from "../../../components/NavBar";
import { parseUser } from "../../../utils/parse-user";
import { Bot, DBUser, DiscordUser } from "../../../utils/types";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

export default function Index(props: { user: DiscordUser, bot: Bot, botUser: DiscordUser, appURL: string, voted: DBUser | null }) {
    const [voted, setVoted] = useState((!props.user ? true : false) || props.voted !== null && (props.voted.lastVoteDate + 7200000) > Date.now());

    const [voteLoading, setVoteLoading] = useState(false);
    const [voteTimeout, setVoteTimeout] = useState<string>();


    const vote = async () => {
        setVoteLoading(true);
        setVoted(true);

        if (!props.user) return;

        if (props.voted !== null && (props.voted.lastVoteDate + 7200000) > Date.now()) return;

        const res = await axios.post(`/api/bots/${props.bot.botId}/vote`, {
            userId: props.user.id
        });

        if (res.status === 200) {
            window.location.href = props.appURL;
        }
    }

    const convert = (time: number) => {

        const hours = Math.floor(time / 3600);
        const minutes = Math.floor(time / 60) - (hours * 60);
        const seconds = time % 60;

        if (hours === 0 && minutes === 0 && seconds === 0) return setVoteTimeout("2h 0m 0s");

        if (hours === 0 && minutes === 0) return setVoteTimeout(`${seconds}s`);

        if (hours === 0) return setVoteTimeout(`${minutes}m ${seconds}s`);

        return setVoteTimeout(`${hours}h ${minutes}m ${seconds}s`);
    }

    setInterval(() => {
        if (props.voted !== null && (props.voted.lastVoteDate + 7200000) > Date.now()) {
            convert(Math.floor((props.voted.lastVoteDate + 7200000 - Date.now()) / 1000));
        }
    }, 1000);

    return (
        <>
            <Head>
                <meta property="og:title" content={`${props.bot.username} | Votes`} />
                <meta property="og:description" content={props.bot.description || "YopBot List est une liste de bots discord qui vous permet de trouver des bots discord de qualité."} />
                <meta property="og:image" content={props.bot.avatar} />
                <meta property="og:url" content={`https://www.yopbotlist.me/bots/${props.bot.botId}/vote`} />
                <meta property="og:type" content="website" />
            </Head>
            <NavBar user={props.user} redirectRoute={`/bots-${props.bot.botId}-vote`}/>
            <div className="main">
                <div className="voteCard">
                    <div className="botCardHeader">
                        <Image src={props.bot.avatar} alt="Bot Avatar" className="botAvatar" width={100} height={100} />
                        <div className="botInfo">
                            <h1 className="botName">{props.botUser.username}</h1>

                            <div className="botStats">
                                <div className="botStat">
                                    <h1 className="botStatNumber">{props.bot.likes}</h1>
                                    <h2 className="botStatName">Votes</h2>
                                </div>
                            </div>

                            <div className="botButtons">
                                {!props.user ? <div className="auth">
                                    <p>Vous devez être connecté pour voter</p>
                                    <Link href={`/api/oauth/bots-${props.bot.botId}-vote`} className="botButton">Se connecter</Link>
                                </div> : null}

                                {props.user &&
                                props.voted !== null && (props.voted.lastVoteDate + 7200000) > Date.now() && <div className="auth">
                                    <p>Vous avez déjà voté il y a moins de 2 heures. Veuillez réessayer dans {voteTimeout}</p>
                                </div>}

                                <button className="botButton" onClick={vote} disabled={voted}>
                                    {voteLoading ? <div className="loader">
                                        <span></span>
                                    </div> : "Voter"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<{ user: DiscordUser, bot: Bot, botUser: DiscordUser, appURL: string, voted: DBUser | null }> = async (ctx) => {
    const user = parseUser(ctx);

    const getBot = async () => {
        const res = await axios.get(`${process.env.APP_URL}/api/bots/${ctx.query.id}`);
        return res.data;
    }

    const bot = await getBot();

    const redirectBot = {
        redirect: {
            destination: `/bots`,
            permanent: false
        }
    }

    if (!bot) return redirectBot;

    const botToUser = async (bot: Bot) => {
        const res = await axios.get(`https://discord.com/api/users/${bot.botId}`, {
            headers: {
                Authorization: `Bot ${process.env.CLIENT_TOKEN}`
            }
        });

        return res.data;
    }

    const voteUser = async () => {
        if (!user) return null;

        const res = await axios.get(`${process.env.APP_URL}/api/users/${user.id}/voted`);

        return res.data;
    }
    const botUser = await botToUser(bot);


    return { props: { user, bot, botUser, appURL: `${process.env.APP_URL}/bots/${ctx.query.id}`, voted: await voteUser() } };
}
