import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../../lib/dbConnect";
import { bots } from "../../../models";
import { Bot } from "../../../utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method !== "GET") return res.status(405).json({error: "Method not allowed"});

    const bot = await bots.findOne({botId: req.query.id});

    if (!bot) return res.status(404).json({error: "Bot not found"});

    res.status(200).json(bot);
}