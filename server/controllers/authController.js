import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';



export const signup = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, email, password: hashedPassword});
        await newUser.save();

        res.status(201).json({message: 'User created'});
    } catch (error) {
        res.status(500).json({error: 'Error creating user'});
    }
};


export const signin = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({username});
        if (!user) return res.status(400).json({error: 'User not found'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({error: 'Invalid credentials'});

        const token = jwt.sign({id: user._id, username: user.username}, 'avinash', {expiresIn: '1h'});
        res.json({token});
    } catch (error) {
        res.status(500).json({error: 'Error logging in'});
    }
};