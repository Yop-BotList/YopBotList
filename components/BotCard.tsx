import {Bot} from "../utils/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function BotCard(props: { bot: Bot, popular: number }) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const botAvatar = document.getElementById(`bot-avatar-${props.bot.botId}`) as HTMLImageElement;
        
        botAvatar.addEventListener("load", () => {
            setLoaded(true);
        });
    }, []);

    return (
        <div className="botCard">
            <div className="head">
                {props.popular === 0 && <div className="popular">Le plus voté</div>}
                <Image src={props.bot.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"} alt={props.bot.username} className={`avatarBot${loaded ? "" : " skeleton"}`} draggable={false} id={`bot-avatar-${props.bot.botId}`} width={100} height={100} />
            </div>
            <div className="infos">
                <h1 className="usernameBot">{props.bot.username || "Aucun nom"}</h1>
                {props.bot.description && <p className="descBot">{props.bot.description.length > 100 ? props.bot.description.substring(0, 100) + "..." : props.bot.description}</p>}
            </div>
            <div className="links">
                <Link href={`/bots/${props.bot.botId}`} className="mainLink">Voir</Link>
                <div className="secondaryLinks">
                    <a href={`https://discord.com/oauth2/authorize?client_id=${props.bot.botId}&scope=bot&permissions=-1`} target="_blank" rel="noreferrer" className="botInvite">Invite</a>
                    {props.bot.site && <a href={props.bot.site} target="_blank" rel="noreferrer" className="botSite">Website</a>}
                </div>
            </div>
        </div>
    )
}


