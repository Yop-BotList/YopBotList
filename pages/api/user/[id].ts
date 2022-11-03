import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../../lib/dbConnect";
import { bots } from "../../../models";
import { Bot } from "../../../utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method !== "GET") return res.status(405).json({error: "Method not allowed"});

    let userBots = await bots.find({ownerId: req.query.id});

    console.log(req.query.id);

    if (userBots.length === 0) {
        userBots = await bots.find();

        userBots = userBots.filter((bot: Bot) => bot.team.includes(`${req.query.id}`));

        console.log(userBots);

        return res.status(200).json(userBots);
    }

    res.status(200).json(userBots);
}