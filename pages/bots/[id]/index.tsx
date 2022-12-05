import { parseUser } from "../../../utils/parse-user";
import { Bot, DiscordUser } from "../../../utils/types";
import Navbar from "../../../components/NavBar";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import { marked } from "marked";

export default function bot(props: { user: DiscordUser, bot: Bot, team: DiscordUser[], owner: DiscordUser[] }) {
    const [showSignPopup, setShowSignPopup] = useState(false);
    const [signalError, setSignalError] = useState(false);

    const signalBot = async () => setShowSignPopup(true);
    
    useEffect(() => {
        const description = document.getElementById("description") as HTMLParagraphElement;

        if (description) description.innerHTML = marked.parse(props.bot.description);
    });

    const signaler = async (e: any) => {
        e.preventDefault();

        const textarea = document.getElementById("reason") as HTMLTextAreaElement;

        if (textarea.value.length === 0) return setSignalError(true);
        if (textarea.value.length > 1000) return setSignalError(true);

        const res = await axios.post(`/api/bots/${props.bot.botId}/signaler`, {
            userId: props.user.id,
            reason: textarea.value
        });

        if (res.status === 200) {
            setSignalError(false);
            window.location.reload();
        }
    }
    return (
        <>
            <Head>
                <title>{props.bot.username} - Bots</title>
                <meta property="og:title" content={`${props.bot.username} | Bots`} />
                <meta property="og:description" content={props.bot.description || "YopBot List est une liste de bots discord qui vous permet de trouver des bots discord de qualité."} />
                <meta property="og:image" content={props.bot.avatar} />
                <meta property="og:url" content={`https://www.yopbotlist.me/bots/${props.bot.botId}`} />
                <meta property="og:type" content="website" />
            </Head>
            <Navbar user={props.user} redirectRoute={`/bots-${props.bot.botId}`} /> 
            <div className={`signalPopup${showSignPopup ? " show" : ""}`}>
                <div className="signalBot">
                    <h1>Signaler le bot</h1>
                    <p>Vous allez signaler le bot <b>{props.bot.username}</b> pour la raison suivante :</p>
                    <textarea placeholder="Raison du signalement" id="reason" className={signalError ? "error" : ""}></textarea>
                    <div className="buttons">
                        <button onClick={() => setShowSignPopup(false)}>Annuler</button>
                        <button onClick={signaler}>Signaler</button>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="bot">
                    <div className="header">
                        <div className="botInfo">
                            <img src={props.bot.avatar} alt="Avatar" />
                            <h1>{props.bot.username}</h1>
                            <p id="description"></p>
                        </div>
                        <div className="info">
                            <div className="links">
                                {props.bot.site && <a href={props.bot.site} target="_blank" rel="noreferrer">Site web</a>}
                                <a href={`https://discord.com/oauth2/authorize?client_id=${props.bot.botId}&scope=bot&permissions=-1`} target="_blank" rel="noreferrer">Inviter</a>
                                {props.bot.supportInvite && <a href={props.bot.supportInvite} target="_blank" rel="noreferrer">Serveur support</a>}
                                <Link href={`/bots/${props.bot.botId}/vote`} rel="noreferrer">Voter: <span>{props.bot.likes}</span></Link>
                                {props.user && <button onClick={signalBot}>Signaler</button>}
                                {props.user && (props.bot.ownerId === props.user.id || props.bot.team.includes(props.user.id)) && <Link href={`/bots/${props.bot.botId}/edit`} rel="noreferrer">Editer</Link>}
                            </div>
                        </div>
                    </div>
                    <div className="stats">
                        {props.bot.serverCount !== undefined && props.bot.serverCount !== 0 && <div className="stat">
                            <h1>{props.bot.serverCount}</h1>
                            <p>Serveurs</p>
                        </div>}
                        {props.bot.userCount !== undefined && props.bot.userCount !== 0 && <div className="stat">
                            <h1>{props.bot.userCount}</h1>
                            <p>Utilisateurs</p>
                        </div>}
                        {props.bot.shardCount !== undefined && props.bot.shardCount !== 0 && <div className="stat">
                            <h1>{props.bot.shardCount}</h1>
                            <p>Shards</p>
                        </div>}
                        <div className="stat">
                            <h1>{props.bot.prefix}</h1>
                            <p>Prefix</p>
                        </div>
                        <div className="stat">
                            {props.owner.map((owner) => (
                                <a className="teamMember" href={`/users/${owner.id}`}>
                                    <img src={`https://cdn.discordapp.com/avatars/${owner.id}/${owner.avatar}.png`} alt="Avatar" className="skeleton" />
                                    <p>{owner.username}</p>
                                </a>
                            ))}
                            <p>Propriétaire</p>
                        </div>
                        {props.bot.team.length !== 0 && (<div className="stat">
                            {props.team.map((member) => (
                                <a className="teamMember" href={`/users/${member.id}`}>
                                    <img src={`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png`} alt="Avatar" className="skeleton" />
                                    <p>{member.username}</p>
                                </a>
                            ))}
                            <p>Équipe</p>
                        </div>)}
                    </div>
                </div>
            </div>
        </>
    );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<{ user: DiscordUser, bot: Bot }> = async (ctx) => {
    const user = parseUser(ctx);
    const botId = ctx.query.id;

    const getBot = async () => {
        //@ts-ignore
        let res;

        try {
            res = await axios.get(`${process.env.APP_URL}/api/bots/${botId}`);
        } catch (e) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false
                }
            }
        }

        return res.data;
    }

    const teamToDiscordUsers = async (team: string[]) => {
        const teamUsers = team.map(async (member) => {
            let res;

            try {
                res = await axios.get(`https://discord.com/api/users/${member}`, {
                    headers: {
                        Authorization: `Bot ${process.env.CLIENT_TOKEN}`
                    }
                });
            } catch (e) {
                return member;
            }

            return res.data;
        });

        return Promise.all(teamUsers);
    }

    const bot = await getBot();

    return { props: { user: user, bot: bot, team: await teamToDiscordUsers(bot.team), owner: await teamToDiscordUsers([bot.ownerId]) } };
}