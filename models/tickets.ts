import {Schema, model, models} from "mongoose";

export default models.tickets || model("tickets", new Schema({
    channelId: { type: String, required: false },
    userId: { type: String, required: false },
    reason: { type: String, required: false }
}));