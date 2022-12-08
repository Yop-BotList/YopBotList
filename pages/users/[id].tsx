import { parseUser } from "../../utils/parse-user";
import {Bot, DBUser, DiscordUser} from "../../utils/types";
import Navbar from "../../components/NavBar";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

export default function bot(props: { user: DiscordUser, userData: DiscordUser, db: { bots: Bot[], user: DBUser } }) {
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

                        <div className="badges">
                            {props.db.user?.badges && props.db.user.badges.filter(badge => badge.id === "dev")[0] ? (
                                <div className="badge">
                                    <Image src="/dev.png" alt="Dev" width={32} height={32} />
                                    <span className="tooltip">
                                        Développeur
                                        <span className="downarrow"></span>
                                    </span>
                                </div>
                            ) : null}
                            {props.db.user?.badges && props.db.user.badges.filter(badge => badge.id === "partner")[0] ? (
                                <div className="badge">
                                    <Image src="/partner.png" alt="Partner" width={32} height={32} />
                                    <span className="tooltip">
                                        Partenaire
                                        <span className="downarrow"></span>
                                    </span>
                                </div>
                            ) : null}
                            {props.db.user?.badges && props.db.user.badges.filter(badge => badge.id === "premium")[0] ? (
                                <div className="badge">
                                    <Image src="/premium.png" alt="Premium" width={32} height={32} />
                                    <span className="tooltip">
                                        Premium
                                        <span className="downarrow"></span>
                                    </span>
                                </div>
                            ) : null}
                            {props.db.user?.badges && props.db.user.badges.filter(badge => badge.id === "staff")[0] ? (
                                <div className="badge">
                                    <Image src="/staff.png" alt="Staff" width={32} height={32} />
                                    <span className="tooltip">
                                        Staff
                                        <span className="downarrow"></span>
                                    </span>
                                </div>
                            ) : null}
                            {props.db.user?.badges && props.db.user.badges.filter(badge => badge.id === "support")[0] ? (
                                <div className="badge">
                                    <Image src="/support.png" alt="Support" width={32} height={32} />
                                    <span className="tooltip">
                                        Support
                                        <span className="downarrow"></span>
                                    </span>
                                </div>
                            ) : null}
                            {props.db.user?.badges && props.db.user.badges.filter(badge => badge.id === "verificator")[0] ? (
                                <div className="badge">
                                    <Image src="/verificators.png" alt="Verificators" width={32} height={32} />
                                    <span className="tooltip">
                                        Vérificateur
                                        <span className="downarrow"></span>
                                    </span>
                                </div>
                            ) : null}
                        </div>

                        <div className="buttons">
                            <a href={`https://discord.com/users/${props.userData.id}`} target="_blank" className="button">View on Discord</a>
                        </div>
                    </div>

                    <div className="info">
                        <h1>Robots de {props.userData.username}#{props.userData.discriminator}</h1>

                        <div className="bots">
                            {props.db.bots.map((bot, index) => (
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
export const getServerSideProps: GetServerSideProps<{ user: DiscordUser, bot: Bot, db: { bots: Bot[], user: DBUser } }> = async (ctx) => {
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

    const userData = async () => {
        const res = await axios.get(`${process.env.APP_URL}/api/users/${ctx.query.id}`);

        return res.data;
    }

    const data = await userData();

    return { props: { user, userData: await getUser(), db: { bots: data.bots, user: data.user } } };
}