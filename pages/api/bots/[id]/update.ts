import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../../../lib/dbConnect";
import { bots } from "../../../../models";
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

    if (!bot.team.includes(userId)) {
        if (bot.ownerId !== userId) return res.status(401).json({error: "Unauthorized"});
        else if (bot.ownerId === userId) {
            const fetchDiscordUser = async () => {
                const response = await axios.get(`https://discord.com/api/users/${bot.botId}`, {
                    headers: {
                        Authorization: `Bot ${process.env.CLIENT_TOKEN}`
                    }
                });
        
                return response.data;
            }
        
            const discordUser = await fetchDiscordUser();
        
            if (!discordUser) return res.status(404).json({error: "Bot not found"});
        
            bot.avatar = `https://cdn.discordapp.com/avatars/${bot.botId}/${discordUser.avatar}.png`;
            bot.username = discordUser.username;
        
            await bot.save();
        
            return res.status(200).json({success: true});
        }

        return res.status(401).json({error: "Unauthorized"});
    }
}