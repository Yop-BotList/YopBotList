import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../../../lib/dbConnect";
import { bots } from "../../../../models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

    const botId = req.query.id;

    if (!botId) return res.status(200).json({error: "notgoodid"});

    const bot = await bots.findOne({botId});

    if (!bot) return res.status(200).json({error: "nobot"});

    const { prefix, description, tags, links } = req.body;

    if (!prefix) return res.status(200).json({error: "noprefix"});
    if (!description) return res.status(200).json({error: "nodescription"});
    if (!tags || tags.length === 0) return res.status(200).json({error: "notags"});

    if (prefix.length > 5) return res.status(200).json({error: "prefixtoolong"});

    bot.prefix = prefix;
    bot.description = description;
    bot.tags = tags;

    if (links) {
        bot.supportInvite = links.invite ?? bot.supportInvite;
        bot.site = links.website ?? bot.site;
    }

    await bot.save();

    res.status(200).json({success: true});
}