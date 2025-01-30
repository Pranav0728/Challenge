// models/Data.js
import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    dob: { type: Date, required: true },
  },
  { timestamps: true }
);

const Data = mongoose.models.Data || mongoose.model('Data', DataSchema);

export default Data;
