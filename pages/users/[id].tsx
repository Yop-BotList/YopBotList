import { parseUser } from "../../utils/parse-user";
import { Bot, DiscordUser } from "../../utils/types";
import Navbar from "../../components/NavBar";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

export default function bot(props: { user: DiscordUser, userData: DiscordUser, bots: Bot[] }) {
    return (
        <>
            <Head>
                <meta property="og:title" content={`${props.userData.username} | Utilisateurs`} />
                <meta property="og:description" content={"YopBot List est une liste de bots discord qui vous permet de trouver des bots discord de qualité."} />
                <meta property="og:image" content={`https://cdn.discordapp.com/avatars/${props.userData.id}/${props.userData.avatar}.png`} />
                <meta property="og:url" content={`https://www.yopbotlist.me/users/${props.userData.id}`} />
                <meta property="og:type" content="website" />
            </Head>
            <Navbar user={props.user} redirectRoute={`/users-${props.userData.id}`} />
            <div className="userCard">
                <div className="header">
                    <div className="profile">
                        <Image src={`https://cdn.discordapp.com/avatars/${props.userData.id}/${props.userData.avatar}.png`} alt="Avatar" className="avatar" width={150} height={150} />
                        <h1>{props.userData.username}#{props.userData.discriminator}</h1>

                        <div className="badge">
                            <Image src="/dev.png" alt="Dev" width={32} height={32} />
                            <span className="tooltip">Développeur</span>
                        </div>

                        <div className="buttons">
                            <a href={`https://discord.com/users/${props.userData.id}`} target="_blank" className="button">View Profile</a>
                        </div>
                    </div>

                    <div className="info">
                        <h1>Robots de {props.userData.username}#{props.userData.discriminator}</h1>

                        <div className="bots">
                            {props.bots.map((bot, index) => (
                                <div className="bot" key={index}>
                                    <Image src={bot.avatar} alt="Avatar" className="avatar" width={150} height={150} />
                                    <h1>{bot.username}</h1>
                                    {bot.description && <p>{bot.description.substring(0, 100)}...</p>}
                                    <Link href={`/bots/${bot.botId}`} className="button">
                                        Voir le bot
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<{ user: DiscordUser, bot: Bot }> = async (ctx) => {
    const user = parseUser(ctx);

    const getUser = async () => {
        //@ts-ignore
        let res;

        try {
            res = await axios.get(`https://discord.com/api/users/${ctx.query.id}`, {
                headers: {
                    Authorization: `Bot ${process.env.CLIENT_TOKEN}`
                }
            });
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

    const userBots = async () => {
        const res = await axios.get(`${process.env.APP_URL}/api/users/${ctx.query.id}`);

        return res.data;
    }

    return { props: { user, userData: await getUser(), bots: await userBots() } };
}