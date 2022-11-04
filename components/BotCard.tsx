import {Bot} from "../utils/types";
import Link from "next/link";

export default function BotCard(props: { bot: Bot }) {
    return (
        <div className="botCard">
            <div className="head">
                <img src={props.bot.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"} alt="Avatar" className="avatarBot" />
            </div>
            <div className="infos">
                <h1 className="usernameBot">{props.bot.username || "Aucun nom"}</h1>
                {props.bot.description && <p className="descBot">{props.bot.description}</p>}
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


