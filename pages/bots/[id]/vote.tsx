import { GetServerSideProps } from "next";
import axios from "axios";
import NavBar from "../../../components/NavBar";
import { parseUser } from "../../../utils/parse-user";
import { Bot, DiscordUser } from "../../../utils/types";

export default function Index(props: { user: DiscordUser, bot: Bot, botUser: DiscordUser, appURL: string }) {
    const vote = async () => {
        const res = await axios.post(`/api/bots/${props.bot.botId}/vote`, {
            userId: props.user.id
        });

        if (res.status === 200) {
            window.location.href = props.appURL;
        }
    }

    return (
        <div>
            <NavBar user={props.user} redirectRoute={`/bots-${props.bot.botId}-vote`}/>
            <div className="main">
                <div className="voteCard">
                    <div className="botCardHeader">
                        <img src={props.bot.avatar} alt="Bot Avatar" className="botAvatar"/>
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
                                    <a href={`/api/oauth/bots-${props.bot.botId}-vote`} className="botButton">Se connecter</a>
                                </div> : null}
                                {props.user && (props.bot.ownerId === props.user.id || props.bot.team.includes(props.user.id)) && <a href={`/bots/${props.bot.botId}/edit`} className="botButton">Edit</a>}

                                <button className="botButton" onClick={vote} disabled={(!props.user ? true : false)}>Voter</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<{ user: DiscordUser, bot: Bot }> = async (ctx) => {
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

    const botUser = await botToUser(bot);

    return { props: { user, bot, botUser, appURL: `${process.env.APP_URL}/bots/${ctx.query.id}` } };
}