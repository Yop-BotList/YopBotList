import { GetServerSideProps } from "next";
import {Bot, Props} from "../utils/types";
import { parseUser } from "../utils/parse-user";
import NavBar from "../components/NavBar";
import BotCard from "../components/BotCard";
import axios from "axios";

export default function Index(props: Props) {
    return (
        <div>
            <NavBar user={props.user}/>
            <div className="main">
                <h1>Index</h1>
                <div className="botCards">

                </div>
            </div>
        </div>
    );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const user = parseUser(ctx);

    const getBots = async () => {
        const bots: { api: any; db: Bot; }[] = [];
        const res = await axios.get(`${process.env.APP_URL}/api/bots`);
        res.data.data.map(async (bot: Bot) => {
            //const discordRes = await axios.get(`https://discord.com/api/users/${bot.botId}`, {
            //                 headers: { Authorization: `Bot ${process.env.CLIENT_TOKEN}` }
            //             });
            //
            //             bots.push({
            //                 api: discordRes.data,
            //                 db: bot
            //             });
        });
        return bots;
    }

    return { props: { user: user, bots: await getBots() } };
}