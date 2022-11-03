import {NextApiRequest, NextApiResponse} from "next";
import bots from "../../models/bots";
import dbConnect from "../../lib/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method !== "GET") return res.status(405).json({error: "Method not allowed"});

    const botsArray = await bots.find();

    res.status(200).json({ success: true, data: botsArray });
}