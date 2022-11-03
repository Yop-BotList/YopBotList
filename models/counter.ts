import {Schema, model, models} from "mongoose";

export default models.counter || model("counter", new Schema({
    counter: { type: Number, required: false, default: 0 },
    lastCountUser: { type: String, required: false }
}));