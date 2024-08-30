import {Message} from '../models/messageModel.js';


export const getChatHistory = async (req, res) => {
    try {
        const messages = await Message.find().sort({timestamp: 1});
        req.json(messages);
    } catch (error) {
        res.status(500).json({error: 'Error fetching chat history'});
    }
};