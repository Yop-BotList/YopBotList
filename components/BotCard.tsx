import {Bot} from "../utils/types";

export default function BotCard(props: { bot: Bot }) {
    return (
        <div className="botCard">
            <div className="head">
                <img src={props.bot.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"} alt="Avatar" className="avatarBot" />
            </div>
            <div className="infos">
                <h1 className="usernameBot">{props.bot.username || "Aucun nom"}</h1>
                <p className="descBot">{props.bot.description}</p>
            </div>
            <div className="links">
                <a href={`/bots/${props.bot.botId}`} className="mainLink">Voir</a>
                <div className="secondaryLinks">
                    <a href={`https://discord.com/oauth2/authorize?client_id=${props.bot.botId}&scope=bot&permissions=-1`} target="_blank" rel="noreferrer" className="botInvite">Invite</a>
                    {props.bot.site ? <a href={props.bot.site} target="_blank" rel="noreferrer" className="botSite">Website</a> : null}
                </div>
            </div>
        </div>
    )
}


