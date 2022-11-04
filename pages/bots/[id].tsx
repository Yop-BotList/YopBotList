import { parseUser } from "../../utils/parse-user";
import { Bot, DiscordUser } from "../../utils/types";
import Navbar from "../../components/NavBar";
import axios from "axios";

export default function bot(props: { user: DiscordUser, bot: Bot }) {
    return (
        <>
            <Navbar user={props.user} />
            <div className="container">
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