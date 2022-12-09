import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../../../lib/dbConnect";
import { bots, users } from "../../../../models";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

    const botId = req.query.id;

    if (!botId) return res.status(400).json({error: "Bad request"});

    const bot = await bots.findOne({botId});

    if (!bot) return res.status(404).json({error: "Bot not found"});

    const userId = req.body.userId;

    if (!userId) return res.status(400).json({error: "Bad request"});

    const userDoc = await users.findOne({userId: userId});

    if (userDoc && (userDoc.lastVoteDate + 7200000) > Date.now()) return res.status(400).json({error: "You have already voted for this bot in the last 2 hours"});
    
    const hook = process.env.VOTE_HOOK;

    if (!hook) return res.status(500).json({error: "Internal server error"});

    const user = await axios.get(`https://discord.com/api/users/${userId}`, {
        headers: {
            Authorization: `Bot ${process.env.CLIENT_TOKEN}`
        }
    });

    const data = {
        embeds: [
            {
                title: "Vote !",
                description: `${user.data.username}#${user.data.discriminator} vient de voter pour ${bot.username} !\nMerci à lui !\n\n${bot.username} a maintenant ${bot.likes+1} votes !`,
                color: 0xf2ac34,
                url: `${process.env.APP_URL}/bots/${bot.botId}/vote`,
                thumbnail: {
                    url: bot.avatar
                }
            }
        ]
    }

    if (bot.voteHook) await axios.post(bot.voteHook, data);

    await axios.post(hook, data);

    bot.likes += 1;

    await bot.save();

    if (!userDoc) return res.status(404).json({error: "User not found"});

    userDoc.lastVoteDate = Date.now();

    await userDoc.save();

    res.status(200).json({success: "Successfully liked bot"});
}