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

    const { userId, reason } = req.body;

    if (!userId) return res.json({error: "Bad request"});
    if (!reason) return res.json({error: "Bad request"});

    const hook = process.env.STAFF_HOOK;

    if (!hook) return res.status(500).json({error: "Internal server error"});

    const user = await axios.get(`https://discord.com/api/users/${userId}`, {
        headers: {
            Authorization: `Bot ${process.env.CLIENT_TOKEN}`
        }
    });

    await axios.post(hook, {
        embeds: [
            {
                title: "Signalement !",
                description: `${user.data.username}#${user.data.discriminator} vient de signaler ${bot.username} !\nMerci à lui !`,
                fields: [
                    {
                        name: "Raison",
                        value: reason
                    }
                ],
                color: 0xf2ac34,
                url: `${process.env.APP_URL}/bots/${bot.botId}`,
                thumbnail: {
                    url: bot.avatar
                }
            }
        ]
    });

    res.status(200).json({success: "Successfully liked bot"});
}