import { parseUser } from "../../utils/parse-user";
import { Bot, DiscordUser } from "../../utils/types";
import Navbar from "../../components/NavBar";
import axios from "axios";

export default function bot(props: { user: DiscordUser, bot: Bot }) {
    return (
        <>
            <Navbar user={props.user} />
            <div className="container">
                <div className="bot">
                    <div className="header">
                        <img src={props.bot.avatar} alt="Avatar" />
                        <h1>{props.bot.username}</h1>
                        <p>{props.bot.description}</p>
                        <div className="info">
                            <div className="links">
                                {props.bot.site && <a href={props.bot.site} target="_blank" rel="noreferrer">Site web</a>}
                                <a href={`https://discord.com/oauth2/authorize?client_id=${props.bot.botId}&scope=bot&permissions=-1`} target="_blank" rel="noreferrer">Inviter</a>
                                {props.bot.supportInvite && <a href={props.bot.supportInvite} target="_blank" rel="noreferrer">Serveur support</a>}
                                <a href={`/vote/${props.bot.botId}`} target="_blank" rel="noreferrer">Voter: <span>{props.bot.likes}</span></a>
                                <a href={`/report/${props.bot.botId}`} target="_blank" rel="noreferrer">Signaler</a>
                                {props.user && (props.bot.ownerId === props.user.id || props.bot.team.includes(props.user.id)) && <a href={`/bots/${props.bot.botId}/edit`} target="_blank" rel="noreferrer">Editer</a>}
                                {props.user && (props.bot.ownerId === props.user.id || props.bot.team.includes(props.user.id)) && <a href={`/bots/${props.bot.botId}/delete`} target="_blank" rel="noreferrer">Supprimer</a>}
                            </div>
                        </div>
                    </div>
                    <div className="stats">
                        {0 !== 0 && <div className="stat">
                            <h1>{0}</h1>
                            <p>Serveurs</p>
                        </div>}
                        {0 !== 0 && <div className="stat">
                            <h1>{0}</h1>
                            <p>Utilisateurs</p>
                        </div>}
                        {0 !== 0 && <div className="stat">
                            <h1>{0}</h1>
                            <p>Shards</p>
                        </div>}
                        <div className="stat">
                            <h1>{props.bot.prefix}</h1>
                            <p>Prefix</p>
                        </div>
                        <div className="stat">
                            <h1>{props.bot.ownerId}</h1>
                            <p>Propriétaires</p>
                        </div>
                        {props.bot.team.length !== 0 && (<div className="stat">
                            {props.bot.team.map((member) => (
                                <h1>{member}</h1>
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
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const user = parseUser(ctx);
    const botId = ctx.query.id;

    const getBots = async () => {
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

    return { props: { user: user, bot: await getBots() } };
}