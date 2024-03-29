import { GetServerSideProps } from "next";
import axios from "axios";
import NavBar from "../../../components/NavBar";
import { parseUser } from "../../../utils/parse-user";
import { Bot, DiscordUser } from "../../../utils/types";
import { FormEvent, useState } from "react";
import EditPopup from "../../../components/EditPopup";
import {BsArrowRepeat, BsFillEyeFill, BsFillEyeSlashFill, BsQuestionCircle} from "react-icons/bs";
import Image from "next/image";
import Head from "next/head";

export default function Index(props: { user: DiscordUser, bot: Bot }) {
    const [show, setShow] = useState(false);
    const [type, setType] = useState("");

    const [showToken, setShowToken] = useState(false);
    const [token, setToken] = useState(props.bot.apiToken);

    const [clicked1, setClicked1] = useState(false);
    const [clicked2, setClicked2] = useState(false);

    const toggleClicked1 = () => setClicked1(!clicked1);
    const toggleClicked2 = () => setClicked2(!clicked2);
    const toggleShowToken = () => setShowToken(!showToken);

    const hidePopup = () => {
        setShow(false);

        if (!type) window.location.href = `/bots/${props.bot.botId}`;
    }

    const generateToken = () => {
        axios.post("/api/bots/generate-token", {
            botId: props.bot.botId
        }).then(res => {
            if (res.data.success) {
                setToken(res.data.token);
                setShowToken(true);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    const updateBot = async (e: FormEvent<HTMLFormElement>) => {  
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const description = form.description.value; 
        const prefix = form.botPrefix.value;
        const tagsList = form.tags;
        const invite = form.invite.value;
        const website = form.website.value;
        const voteHook = form.voteHook.value;
        const hookCode = form.hookCode.value;
        const apiToken = form.apiToken.value;

        const tags = [];

        for (let i = 0; i < tagsList.length; i++) {
            if (tagsList[i].checked) tags.push(tagsList[i].value);
        }

        const res = await axios.post(`/api/bots/${props.bot.botId}/edit`, {
            description,
            prefix,
            tags,
            links: {
                invite,
                website
            },
            voteHook,
            hookCode,
            apiToken
        });

        setType(res.data.error);
        setShow(true);

        return;
    }

    const updateInfo = async () => {
        const res = await axios.post(`/api/bots/${props.bot.botId}/update`, {
            userId: props.user.id,
        });

        setType(res.data.error);
        setShow(true);

        return;
    }
    return (
        <>
            <Head>
                <title>{props.bot.username} - Bots</title>
                <meta property="og:title" content={`${props.bot.username} | Bots`} />
                <meta property="og:description" content={props.bot.description ? (props.bot.description.length > 100 ? props.bot.description.substring(0, 100) + "..." : props.bot.description) : "YopBot List est une liste de bots discord qui vous permet de trouver des bots discord de qualité."} />
                <meta property="og:image" content={props.bot.avatar} />
                <meta property="og:url" content={`https://www.yopbotlist.me/bots/${props.bot.botId}/edit`} />
                <meta property="og:type" content="website" />
            </Head>
            <NavBar user={props.user} redirectRoute={`/bots-${props.bot.botId}-edit`}/>
            <div className="main">
                <div className="editCard">
                    <EditPopup show={show} hideFunc={hidePopup} type={type} />
                    <div className="header">
                        <Image src={props.bot.avatar} alt="avatar" className="avatar" width={100} height={100} />
                        <div className="info">
                            <h1>{props.bot.username}</h1>
                        </div>

                        <button onClick={updateInfo} className="updateInfo">Mettre à jour l'avatar et le nom du bot</button>
                    </div>
                    <form onSubmit={updateBot}>
                        <div className="prefix">
                            <label htmlFor="botPrefix">Prefix</label>
                            <input type="text" name="botPrefix" id="botPrefix" defaultValue={props.bot.prefix}/>
                        </div>
                        <div className="description">
                            <h1>Description</h1>
                            <textarea name="description" id="description" cols={30} rows={10} defaultValue={props.bot.description}/>
                        </div>
                        <div className="tags">
                            <h1>Tags</h1>
                            <div className="tagsList">
                                <div className="tag">
                                    <input type="checkbox" name="tags" id="musique" value="1" defaultChecked={props.bot.tags.includes("1")}/>
                                    <label htmlFor="musique">
                                        <span className="checkmark">
                                            <span></span>
                                        </span>
                                        Musique
                                    </label>
                                </div>
                                <div className="tag">
                                    <input type="checkbox" name="tags" id="moderation" value="2" defaultChecked={props.bot.tags.includes("2")}/>
                                    <label htmlFor="moderation">
                                        <span className="checkmark">
                                            <span></span>
                                        </span>
                                        Modération
                                    </label>
                                </div>
                                <div className="tag">
                                    <input type="checkbox" name="tags" id="fun" value="3" defaultChecked={props.bot.tags.includes("3")}/>
                                    <label htmlFor="fun">
                                        <span className="checkmark">
                                            <span></span>
                                        </span>
                                        Fun
                                    </label>
                                </div>
                                <div className="tag">
                                    <input type="checkbox" name="tags" id="utilitaire" value="4" defaultChecked={props.bot.tags.includes("4")}/>
                                    <label htmlFor="utilitaire">
                                        <span className="checkmark">
                                            <span></span>
                                        </span>
                                        Utilitaire
                                    </label>
                                </div>
                                <div className="tag">
                                    <input type="checkbox" name="tags" id="autre" value="5" defaultChecked={props.bot.tags.includes("5")}/>
                                    <span className="checkmark"></span>
                                    <label htmlFor="autre">
                                        <span className="checkmark">
                                            <span></span>
                                        </span>
                                        Autre
                                    </label>
                                </div> 
                            </div>
                        </div>
                        <div className="links">
                            <h1>Liens</h1>
                            <div className="linksList">
                                <div className="link">
                                    <label htmlFor="invite">Lien d'invitation du support</label>
                                    <input type="text" name="invite" id="invite" defaultValue={props.bot.supportInvite}/>
                                </div>
                                <div className="link">
                                    <label htmlFor="website">Site web</label>
                                    <input type="text" name="website" id="website" defaultValue={props.bot.site}/>
                                </div>
                            </div>
                        </div>
                        <div className="votes">
                            <h1>Webhook de votes</h1>
                            <div className="vote">
                                <label htmlFor="voteHook">
                                    URL du webhook discord
                                    <span className={`${clicked1 && "clicked"}`} onClick={toggleClicked1}><BsQuestionCircle /></span>
                                    <div className="tooltip">
                                        <a href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks" target="_blank">Discord Webhook</a>
                                        <span className="downarrow"></span>
                                    </div>
                                </label>
                                <input type="text" name="voteHook" id="voteHook" defaultValue={props.bot.voteHook}/>
                            </div>
                            <div className="vote">
                                <label htmlFor="hookCode">
                                    Code du webhook
                                    <span className={`${clicked2 && "clicked"}`} onClick={toggleClicked2}><BsQuestionCircle /></span>
                                    <div className="tooltip">
                                        <p>Ne pas partager, seul vous pouvez le connaitre.</p>
                                        <span className="downarrow"></span>
                                    </div>
                                </label>
                                <input type="text" name="hookCode" id="hookCode" defaultValue={props.bot.hookCode}/>
                            </div>
                        </div>
                        <div className="prefix">
                            <label htmlFor="apiToken">Token de l'API</label>
                            <div className="token">
                                <input type={showToken ? "text" : "password"} name="apiToken" id="apiToken" defaultValue={token}/>
                                <BsArrowRepeat onClick={generateToken} />
                                <span onClick={toggleShowToken}>{showToken ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}</span>
                            </div>
                        </div>
                        <div className="submit">
                            <input type="submit" value="Sauvegarder"/>
                        </div>
                    </form>
                </div>
            </div>
        </>
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
        else if (bot.ownerId === user.id) return { props: { user, bot } };        

        return redirectBot;
    }

    return { props: { user: user, bot: bot } };
}