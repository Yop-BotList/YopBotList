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

    if (!user) return { redirect: { destination: "/api/oauth", permanent: false } }

    if (!bot) return redirectBot;

    if (!bot.team.includes(user.id)) {
        if (bot.ownerId !== user.id) return redirectBot;

        return redirectBot;
    }

    return { props: { user: user, bot: bot } };
}