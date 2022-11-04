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
                <div className="botCards">
                    {props.bots.map((bot) => (
                        <BotCard bot={bot} key={bot.botId}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const user = parseUser(ctx);

    const getBots = async () => {
        const res = await axios.get(`${process.env.APP_URL}/api/bots`);
        return res.data.data;
    }

    return { props: { user: user, bots: await getBots() } };
}