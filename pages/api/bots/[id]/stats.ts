import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../../../lib/dbConnect";
import { bots } from "../../../../models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

    const apiToken = req.headers.authorization;
    const { serverCount, shardCount, userCount } = req.body;
    console.log(serverCount, shardCount, userCount);
    const { id } = req.query;

    const bot = await bots.findOne({ botId: id });

    if (!bot) return res.status(404).json({error: "Bot not found"});

    if (bot.apiToken !== apiToken) return res.status(401).json({error: "Unauthorized"});

    const lastUpdate = bot.latestStatsUpdate
    const now = new Date();

    if (lastUpdate && now.getTime() - lastUpdate.getTime() < 5 * 60 * 1000) return res.status(429).json({error: "Too many requests"});

    bot.serverCount = serverCount;
    bot.shardCount = shardCount;
    bot.userCount = userCount;
    bot.latestStatsUpdate = now;

    await bot.save();

    res.status(200).json({success: true});
}