import { GetServerSideProps } from "next";
import {Bot, Props} from "../utils/types";
import { parseUser } from "../utils/parse-user";
import NavBar from "../components/NavBar";
import BotCard from "../components/BotCard";
import axios from "axios";
import {useEffect, useState} from "react";

export default function bots(props: Props) {
    const [name, setName] = useState("");
    const [prefix, setPrefix] = useState("");
    const [tags, setTags] = useState("");

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
            setTags(searchTags.value);
        });
    }, [name]);

    return (
        <div>
            <NavBar user={props.user}/>
            <div className="main">
                <div className="searchBar">
                    <input type="text" placeholder="Rechercher un bot" id="search1" />
                    <input type="text" placeholder="Rechercher par prefix" id="search2" />
                    <select name="tags" id="tags" placeholder="Rechercher par tag">
                        <option value="0">Tous les tags</option>
                        <option value="1">Musique</option>
                        <option value="2">Modération</option>
                        <option value="3">Fun</option>
                        <option value="4">NSFW</option>
                        <option value="5">Economie</option>
                        <option value="6">Autre</option>
                    </select>
                </div>
                <div className="botCards">
                    {props.bots
                    .sort((a: Bot, b: Bot) => b.likes - a.likes)
                    .filter(bot => bot.username && bot.username.toLowerCase().includes(name.toLowerCase()))
                    .filter(bot => bot.prefix && bot.prefix.toLowerCase().includes(prefix.toLowerCase()))
                    .map((bot, index) => (
                        bot && <BotCard bot={bot} popular={index} key={bot.botId}/>
                    ))}
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