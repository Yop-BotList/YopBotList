import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../../../lib/dbConnect";
import { bots } from "../../../../models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

    const botId = req.query.id;

    if (!botId) return res.status(400).json({error: "Bad request"});

    const bot = await bots.findOne({botId});

    if (!bot) return res.status(404).json({error: "Bot not found"});

    const userId = req.body.userId;

    if (!userId) return res.status(400).json({error: "Bad request"});

    bot.likes += 1;

    await bot.save();

    res.status(200).json({success: "Successfully liked bot"});
}