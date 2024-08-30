import jwt from 'jsonwebtoken';


export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer', '');

    if(!token){
        return res.status(401).json({error: 'No token, authorization denied'});
    }

    try {
        const decoded = jwt.verify(token, 'avinash');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({error: 'Token is not valid'});
    }
};