import {Schema, model, models} from "mongoose";

export default models.verificators || model("verificators", new Schema({
    userId: { type: String, required: false },
    verifications: { type: Number, required: false }
}));