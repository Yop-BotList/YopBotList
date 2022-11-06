import {GetServerSideProps} from "next";
import {parseUser} from "../utils/parse-user";
import NavBar from "../components/NavBar";
import {Bot, DiscordUser} from "../utils/types";
import axios from "axios";
import Link from "next/link";

export default function profile(props: { user: DiscordUser, bots: Bot[], botUsers: DiscordUser[] }) {
    return (
        <div>
            <NavBar user={props.user}/>
            <div className="main">
                <div className="profileSection">
                    {props.user.banner ? <img src={`https://cdn.discordapp.com/banners/${props.user.id}/${props.user.banner}.png?size=1024`} alt="banner" className="banner" /> : null}
                    <img src={`https://cdn.discordapp.com/avatars/${props.user.id}/${props.user.avatar}.png?size=256`} alt="Profile Picture" className="avatar" />
                    <h2 className="username">{props.user.username}#{props.user.discriminator}</h2>

                    <div className="botCards">
                        {props.botUsers.map((bot, index) => (
                            <div className="botCard">
                                <img src={`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png?size=256`} alt="Profile Picture" className="avatar" />
                                <h3 className="botName">{bot.username}</h3>
                                <p className="botDesc">{props.bots[index].description}</p>
                                <div className="botInfos">
                                    <p className="botPrefix">Prefix: {props.bots[index].prefix}</p>
                                    <p className="botVotes">Votes: {props.bots[index].likes}</p>
                                    <Link href={`/bots/${bot.id}`} className="botLink">Voir</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const user = parseUser(ctx);

    const getBots = async () => {
        const res = await axios.get(`${process.env.APP_URL}/api/users/${user!.id}`);

        return res.data;
    }

    const botsToDiscordUsers = async (bots: Bot[]) => {
        return await Promise.all(bots.map(async bot => {
            const api = await axios.get(`https://discord.com/api/users/${bot.botId}`, {
                headers: {
                    Authorization: `Bot ${process.env.CLIENT_TOKEN}`
                }
            });

            return api.data;
        }));
    }

    const bots = await getBots();

    return { props: { user, bots, botUsers: await botsToDiscordUsers(bots) } };
}