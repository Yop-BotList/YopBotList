import { GetServerSideProps } from "next";
import {Bot, Props} from "../utils/types";
import { parseUser } from "../utils/parse-user";
import NavBar from "../components/NavBar";
import BotCard from "../components/BotCard";
import axios from "axios";
import {useEffect, useState} from "react";
import Head from "next/head";

export default function bots(props: Props) {
    const [name, setName] = useState("");
    const [prefix, setPrefix] = useState("");
    const [tags, setTags] = useState<string | undefined>();

    useEffect(() => {
        const searchName = document.getElementById("search1") as HTMLInputElement;
        const searchPrefix = document.getElementById("search2") as HTMLInputElement;
        const searchTags = document.getElementById("tags") as HTMLSelectElement;

        searchName.addEventListener("keyup", (e) => {
            setName(searchName.value);
        });

        searchPrefix.addEventListener("keyup", (e) => {
            setPrefix(searchPrefix.value);
        });

        searchTags.addEventListener("change", (e) => {
            if (searchTags.value === "All") setTags(undefined);
            else setTags(searchTags.value);
        });
    }, [name]);

    const list = props.bots
    .sort((a: Bot, b: Bot) => b.likes - a.likes)
    .filter(bot => bot.username && bot.username.toLowerCase().includes(name.toLowerCase()))
    .filter(bot => bot.prefix && bot.prefix.toLowerCase().includes(prefix.toLowerCase()))
    .filter(bot => {
        if (tags) return bot.tags.includes(tags as string);
        else return true;
    });

    return (
        <div>
            <Head>
                <meta property="og:title" content={`YopBot List | Bots`} />
                <meta property="og:description" content={"YopBot List est une liste de bots discord qui vous permet de trouver des bots discord de qualité."} />
                <meta property="og:image" content="https://cdn.discordapp.com/icons/782644006190055486/abebf32ccdda97f12f9d4aaaa0e064fc.webp" />
                <meta property="og:url" content={`https://www.yopbotlist.me/bots`} />
                <meta property="og:type" content="website" />
            </Head>
            <NavBar user={props.user} redirectRoute={"/bots"}/>
            <div className="main">
                <div className="searchBar">
                    <input type="text" placeholder="Rechercher un bot" id="search1" />
                    <input type="text" placeholder="Rechercher par prefix" id="search2" />
                    <select name="tags" id="tags" placeholder="Rechercher par tag">
                        <option value="All">Tous les tags</option>
                        <option value="1">Musique</option>
                        <option value="2">Modération</option>
                        <option value="3">Fun</option>
                        <option value="4">Utilitaire</option>
                        <option value="5">Autre</option>
                    </select>
                </div>
                <div className="botCards">
                    {list.length > 0 ? list.map((bot, index) => (
                        bot && <BotCard bot={bot} popular={1} key={index}/>
                    )) : ("Aucun bot trouvé dans la liste")}
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