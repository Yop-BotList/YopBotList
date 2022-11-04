import { GetServerSideProps } from "next";
import {Bot, Props} from "../utils/types";
import { parseUser } from "../utils/parse-user";
import NavBar from "../components/NavBar";
import BotCard from "../components/BotCard";
import axios from "axios";
import {useEffect} from "react";

export default function bots(props: Props) {
    let bots = props.bots;

    //useEffect(() => {
    //         const input = document.getElementById("search") as HTMLInputElement;
    //
    //         input.addEventListener("input", (e) => {
    //             const value = (e.target as HTMLInputElement).value;
    //             if (value) {
    //                 const filtered = bots.filter((bot) => bot.username.toLowerCase().includes(value.toLowerCase()));
    //                 console.log(filtered);
    //             }
    //         });
    //     }, []);

    return (
        <div>
            <NavBar user={props.user}/>
            <div className="main">
                <div className="searchBar">
                    <input type="text" placeholder="Rechercher un bot" id="search" />
                </div>
                <div className="botCards">
                    {bots.map((bot) => (
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