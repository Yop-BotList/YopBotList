import { GetServerSideProps } from "next";
import { parseUser } from "../utils/parse-user";
import NavBar from "../components/NavBar";
import {Bot, DiscordUser} from "../utils/types";
import axios from "axios";
import Link from "next/link";

export default function profile(props: { user: DiscordUser, bots: Bot[] }) {
    return (
        <div>
            <NavBar user={props.user}/>
            <div className="main">
                <div className="profileSection">
                    {props.user.banner ? <img src={`https://cdn.discordapp.com/banners/${props.user.id}/${props.user.banner}.png?size=1024`} alt="banner" className="banner" /> : null}
                    <img src={`https://cdn.discordapp.com/avatars/${props.user.id}/${props.user.avatar}.png?size=256`} alt="Profile Picture" className="avatar" />
                    <h2 className="username">{props.user.username}#{props.user.discriminator}</h2>

                    <div className="botCards">
                        {props.bots.map(bot => (
                            <div className="botCard">
                                <h3 className="botName">{bot.botId}</h3>
                                <p className="botDesc">{bot.description}</p>
                                <div className="botInfos">
                                    <p className="botPrefix">Prefix: {bot.prefix}</p>
                                    <p className="botVotes">Votes: {bot.likes}</p>
                                    <Link href={`/${bot.botId}/bot`} className="botLink">View</Link>
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
        //@ts-ignore
        const res = await axios.get(`${process.env.APP_URL}/api/user/${user.id}`);

        return res.data;
    }

    return { props: { user: user, bots: await getBots() } };
}