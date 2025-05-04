import jwt from 'jsonwebtoken';

import redisClient from '../services/redisService.js';


export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.token;
                

    
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }


        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {

            res.cookie('token', '');

            return res.status(401).json({ message: 'Redis Error, User Logged out' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        
        req.user = decoded; // Attach user info to request object
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}