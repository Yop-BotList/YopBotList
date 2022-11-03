import {Schema, model, models} from "mongoose";

export default models.avis || model("avis", new Schema({
    avis: { type: String, required: false },
    userId: { type: String, required: false },
    messageId: { type: String, required: false }
}));