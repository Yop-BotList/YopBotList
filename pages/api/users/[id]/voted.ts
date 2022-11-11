import {NextApiRequest, NextApiResponse} from "next"
import dbConnect from "../../../../lib/dbConnect";
import { users } from "../../../../models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method !== "GET") return res.status(405).json({error: "Method not allowed"});

    const user = await users.findOne({userId: req.query.id});

    if (!user) return res.status(404).json({error: "User not found"});

    res.status(200).json(user);
}