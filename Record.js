import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    date: { type: Date, required: true }
});

export const Record = mongoose.model('Record', recordSchema);
