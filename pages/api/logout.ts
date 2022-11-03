import {NextApiRequest, NextApiResponse} from "next";
import {serialize} from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.redirect("/");

    // delete the cookie
    res.setHeader("Set-Cookie", serialize(process.env.COOKIENAME!, "", {
        maxAge: -1,
        path: "/"
    }));

    res.redirect("/");
}