import { parseUser } from "../../utils/parse-user";
import { Bot, DiscordUser } from "../../utils/types";
import Navbar from "../../components/NavBar";
import axios from "axios";
import Link from "next/link";

export default function bot(props: { user: DiscordUser, bot: Bot, team: DiscordUser[], owner: DiscordUser[] }) {
    const update = async () => {
        const res = await axios.post(`/api/bots/${props.bot.botId}/update`, {
            userId: props.user.id
        });

        if (res.status === 200) {
            window.location.reload();
        }
    }
    return (
        <>
            <Navbar user={props.user} redirectRoute={`/bots-${props.bot.botId}`} />
            <div className="container">
                <div className="bot">
                    <div className="header">
                        <div className="botInfo">
                            <img src={props.bot.avatar} alt="Avatar" />
                            <h1>{props.bot.username}</h1>
                            <p>{props.bot.description}</p>
                        </div>
                        <div className="info">
                            <div className="links">
                                {props.bot.site && <a href={props.bot.site} target="_blank" rel="noreferrer">Site web</a>}
                                <a href={`https://discord.com/oauth2/authorize?client_id=${props.bot.botId}&scope=bot&permissions=-1`} target="_blank" rel="noreferrer">Inviter</a>
                                {props.bot.supportInvite && <a href={props.bot.supportInvite} target="_blank" rel="noreferrer">Serveur support</a>}
                                <Link href={`/bots/${props.bot.botId}/vote`} rel="noreferrer">Voter: <span>{props.bot.likes}</span></Link>
                                <Link href={`/bots/${props.bot.botId}/report`} rel="noreferrer">Signaler</Link>
                                {props.user && (props.bot.ownerId === props.user.id || props.bot.team.includes(props.user.id)) && <Link href={`/bots/${props.bot.botId}/edit`} rel="noreferrer">Editer</Link>}
                                {props.user && (props.bot.ownerId === props.user.id || props.bot.team.includes(props.user.id)) && <Link href={`/bots/${props.bot.botId}/delete`} rel="noreferrer">Supprimer</Link>}
                            </div>
                        </div>
                    </div>
                    <div className="stats">
                        {props.bot.serverCount !== undefined && props.bot.serverCount !== 0 && <div className="stat">
                            <h1>{props.bot.serverCount}</h1>
                            <p>Serveurs</p>
                        </div>}
                        {props.bot.userCount !== undefined && props.bot.userCount !== 0 && <div className="stat">
                            <h1>{props.bot.userCount}</h1>
                            <p>Utilisateurs</p>
                        </div>}
                        {props.bot.shardCount !== undefined && props.bot.shardCount !== 0 && <div className="stat">
                            <h1>{props.bot.shardCount}</h1>
                            <p>Shards</p>
                        </div>}
                        <div className="stat">
                            <h1>{props.bot.prefix}</h1>
                            <p>Prefix</p>
                        </div>
                        <div className="stat">
                            {props.owner.map((owner) => (
                                <a className="teamMember" href={`/users/${owner.id}`}>
                                    <img src={`https://cdn.discordapp.com/avatars/${owner.id}/${owner.avatar}.png`} alt="Avatar" />
                                    <p>{owner.username}</p>
                                </a>
                            ))}
                            <p>Propriétaire</p>
                        </div>
                        {props.bot.team.length !== 0 && (<div className="stat">
                            {props.team.map((member) => (
                                <a className="teamMember" href={`/users/${member.id}`}>
                                    <img src={`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png`} alt="Avatar" />
                                    <p>{member.username}</p>
                                </a>
                            ))}
                            <p>Équipe</p>
                        </div>)}
                    </div>
                </div>
            </div>
        </>
    );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<{ user: DiscordUser, bot: Bot }> = async (ctx) => {
    const user = parseUser(ctx);
    const botId = ctx.query.id;

    const getBot = async () => {
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

    const teamToDiscordUsers = async (team: string[]) => {
        const teamUsers = team.map(async (member) => {
            let res;

            try {
                res = await axios.get(`https://discord.com/api/users/${member}`, {
                    headers: {
                        Authorization: `Bot ${process.env.CLIENT_TOKEN}`
                    }
                });
            } catch (e) {
                return member;
            }

            return res.data;
        });

        return Promise.all(teamUsers);
    }

    const bot = await getBot();

    return { props: { user: user, bot: bot, team: await teamToDiscordUsers(bot.team), owner: await teamToDiscordUsers([bot.ownerId]) } };
}