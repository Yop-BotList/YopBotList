import { parseUser } from "../../utils/parse-user";
import { Bot, DiscordUser } from "../../utils/types";
import Navbar from "../../components/NavBar";
import { useRouter } from "next/router";

export default function bot(props: { user: DiscordUser, bot: Bot }) {
    const router = useRouter();
    const botId = router.query.id;
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

    const getBots = async () => {
        //@ts-ignore
        const res = await axios.get(`${process.env.APP_URL}/api/user/${user.id}`);

        return res.data;
    }

    return { props: { user: user } };
}