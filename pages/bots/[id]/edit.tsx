import { GetServerSideProps } from "next";
import axios from "axios";
import NavBar from "../../../components/NavBar";
import { parseUser } from "../../../utils/parse-user";
import { Bot, DiscordUser } from "../../../utils/types";

export default function Index(props: { user: DiscordUser, bot: Bot }) {
    return (
        <div>
            <NavBar user={props.user}/>
            <div className="main">
                <div className="botCards">
                </div>
            </div>
        </div>
    );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const user = parseUser(ctx);

    const getBot = async () => {
        const res = await axios.get(`${process.env.APP_URL}/api/bots/${ctx.query.id}`);
        console.log(res.data);
        return res.data.data;
    }

    const bot = await getBot();

    if (!bot || !bot.team.includes(user!.id) || bot.ownerId !== user!.id) {
        return {
            redirect: {
                destination: `/bots/${ctx.query.id}`,
                permanent: false
            }
        }
    }

    return { props: { user: user, bot: bot } };
}