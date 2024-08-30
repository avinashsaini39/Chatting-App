import { User } from '../models/userModel.js';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('username email');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};
