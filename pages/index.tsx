import { GetServerSideProps } from "next";
import {Bot, Props} from "../utils/types";
import { parseUser } from "../utils/parse-user";
import NavBar from "../components/NavBar";
import BotCard from "../components/BotCard";
import axios from "axios";

export default function Index(props: Props) {
    return (
        <>
            <NavBar user={props.user} redirectRoute={"/"} />
            <div className="main">
                <div className="headline">
                    <h1>YopBotList</h1>
                    <p>Tu cherches un bot pour ton serveur Discord ? Tu es au bon endroit !</p>
                </div>
                <div className="botCards">
                    {props.bots.map((bot) => (
                        bot && (<BotCard bot={bot} popular={1} key={bot.botId}/>)
                    ))}
                </div>
            </div>
        </>
    );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const user = parseUser(ctx);

    const getBots = async () => {
        const res = await axios.get(`${process.env.APP_URL}/api/bots`);
        return res.data.data.sort((a: Bot, b: Bot) => b.likes - a.likes).slice(0, 6);
    }

    return { props: { user: user, bots: await getBots() } };
}