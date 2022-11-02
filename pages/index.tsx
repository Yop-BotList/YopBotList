import { GetServerSideProps } from "next";
import { DiscordUser } from "../utils/types";
import { parseUser } from "../utils/parse-user";

interface Props {
    user: DiscordUser;
}

export default function Index(props: Props) {
    return (
        <div>
            <h1>Home</h1>
            {props.user ? (
                <div>
                    <h2>Welcome {props.user.username}!</h2>
                    <img alt="" src={`https://cdn.discordapp.com/avatars/${props.user.id}/${props.user.avatar}.png`} />
                </div>
            ) : (
                <div>
                    <h2>Welcome!</h2>
                    <p>You are not logged in.</p>
                    <a href="/api/oauth">Login</a>
                </div>
            )}
        </div>
    );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const user = parseUser(ctx);

    return { props: { user } };
}