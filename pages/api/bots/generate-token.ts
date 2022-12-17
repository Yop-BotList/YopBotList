import {NextApiRequest, NextApiResponse} from "next";
import bots from "../../../models/bots";
import dbConnect from "../../../lib/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method !== "GET") return res.status(405).json({error: "Method not allowed"});

    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";

    for (let i = 0; i < 32; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }

    res.status(200).json({ success: true, token: token });
}