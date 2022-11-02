import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { serialize } from 'cookie';
import { sign } from 'jsonwebtoken';
import {DiscordUser} from "../../utils/types";

const scope = ["identify", "email"].join(" ");
const REDIRECT_URI = "http://localhost:3000/api/oauth";

const OAUTH_PARAMS = new URLSearchParams({
  client_id: `${process.env.CLIENT_ID}`,
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope,
}).toString();

const OAuthURL = `https://discord.com/api/oauth2/authorize?${OAUTH_PARAMS}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.redirect("/");

  const { code = null, error = null } = req.query;

  if (error) return res.redirect(`/?error=${req.query.error}`);

  if (!code || typeof code !== "string") return res.redirect(OAuthURL);

  const body = new URLSearchParams({
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET!,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
    code,
    scope,
  }).toString();

  // @ts-ignore
  const { access_token, token_type = "Bearer" } = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  }).then(res => res.json());

  if (!access_token || typeof access_token !== "string") return res.redirect(OAuthURL);

  // @ts-ignore
  const me: DiscordUser | { unauthorized: true } = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `${token_type} ${access_token}` }
  }).then(res => res.json());

  if (!("id" in me)) return res.redirect(OAuthURL);

  const token = sign(me, process.env.JWT_SECRET!, { expiresIn: "1d" });

  res.setHeader("Set-Cookie", serialize(process.env.COOKIENAME!, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/"
  }));

  res.redirect("/");
}
