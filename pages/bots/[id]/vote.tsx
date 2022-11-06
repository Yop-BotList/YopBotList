import { GetServerSideProps } from "next";
import axios from "axios";
import NavBar from "../../../components/NavBar";
import { parseUser } from "../../../utils/parse-user";
import { Bot, DiscordUser } from "../../../utils/types";

export default function Index(props: { user: DiscordUser, bot: Bot, botUser: DiscordUser }) {
    return (
        <div>
            <NavBar user={props.user}/>
            <div className="main">
                <div className="botCards">
                    <div className="botCard">
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
                                    {(props.bot.ownerId === props.user.id || props.bot.team.includes(props.user.id)) ? <a href={`/bots/${props.bot.botId}/edit`} className="botButton">Edit</a> : null}
                                    {!props.user ? <>
                                        <p>Vous devez être connecté pour voter</p>
                                        <a href="/api/oauth" className="botButton">Se connecter</a>
                                    </> : null}

                                    <button className="botButton" onClick={async () => {
                                        const res = await axios.post(`${process.env.APP_URL}/api/bots/${props.bot.botId}/vote`, {
                                            userId: props.user.id
                                        });
                                        if (res.data.success) {
                                            window.location.reload();
                                        }
                                    }} disabled={(!props.user ? true : false)}>Voter</button>
                                </div>
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
            destination: `/bots/${ctx.query.id}`,
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

    return { props: { user, bot, botUser } };
}