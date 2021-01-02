import mongoose from "mongoose";

const Schema = mongoose.Schema;

const dataSchema = new Schema({
  userId: { type: String, required: [true] },
  dId: { type: String, required: [true] },
  variable: { type: String, required: [true] },
  value: { type: Number, required: [true] },
  time: { type: Number, required: [true] }
});

// Convertir a modelo
const Data = mongoose.model("Data", dataSchema);

export default Data;
