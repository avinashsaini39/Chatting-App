import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    username: { type: String, required: true }, // sender's username
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    to: { type: String, required: true }, // recipient's username or 'group'
    delivered: { type: Boolean, default: false }, // flag to check if the message is delivered
});

export const Message = mongoose.model('Message', messageSchema);
