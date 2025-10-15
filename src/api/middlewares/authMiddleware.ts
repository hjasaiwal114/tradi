import {Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {config} from '../../config';

interface AuthenticatedRequest extends Request {
    user?: {email: string};
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // cookies vagera leleta hu
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({message: 'kya re token leke aaa'});
    }

    try {
        //token vagera check kar leta hu
        const decoded = jwt.verify(token, config.jwtSecret) as {email: string};

        // user ko attach kar rha hu
        req.user = {email: decoded.email};

        next();
    } catch (error) {
        console.error('bhai shab kuch yha bhi fail:', error);
        return res.status(401).json({message: 'Not authorized, token failed'})
    }
}
