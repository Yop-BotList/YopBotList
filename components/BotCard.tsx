import {BotData} from "../utils/types";

export default function BotCard(props: { bot: BotData }) {
    return (
        <div className="botCard">
            <div className="head">
                <img src={props.bot.api.avatar} alt="Avatar"/>

            </div>
            <div className="infos">
                <h1>{props.bot.api.username}</h1>
                <p>{props.bot.db.description}</p>
            </div>
            <div className="links">
                <a href={`https://discord.com/oauth2/authorize?client_id=${props.bot.db.botId}&scope=bot&permissions=-1`} target="_blank" rel="noreferrer">Invite</a>
                <a href={props.bot.db.site} target="_blank" rel="noreferrer">Website</a>
            </div>
        </div>
    )
}


