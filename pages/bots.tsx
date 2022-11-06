import { GetServerSideProps } from "next";
import {Bot, Props} from "../utils/types";
import { parseUser } from "../utils/parse-user";
import NavBar from "../components/NavBar";
import BotCard from "../components/BotCard";
import axios from "axios";
import {useEffect, useState} from "react";

export default function bots(props: Props) {
    const [name, setName] = useState("");

    useEffect(() => {
        const searchBar = document.getElementById("search") as HTMLInputElement;

        searchBar.addEventListener("keyup", (e) => {
            setName(searchBar.value);
        });
    }, [name]);

    return (
        <div>
            <NavBar user={props.user}/>
            <div className="main">
                <div className="searchBar">
                    <input type="text" placeholder="Rechercher un bot" id="search" />
                </div>
                <div className="botCards">
                    {props.bots
                    .filter(bot => bot.username && bot.username.toLowerCase().includes(name.toLowerCase()))
                    .map((bot) => (
                        bot && <BotCard bot={bot} key={bot.botId}/>
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