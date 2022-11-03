import { Schema, model, models } from "mongoose";

const reqString = { type: String, required: true },
    notReqString = { type: String, required: false };

export default models.bots || model("bots", new Schema({
    botId: reqString,
    prefix: reqString,
    ownerId: reqString,
    verified: { type: Boolean, required: false },
    supportInvite: notReqString,
    site: notReqString,
    description: notReqString,
    likes: { type: Number, required: false },
    latestLikeDate: { type: Date, required: false },
    team: { type: [String], required: false },
    checked: { type: Boolean, required: false, default: true }
}));