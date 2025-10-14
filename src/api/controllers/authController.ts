
import {Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {config } from '../../config';
import { sendSignInEmail } from '../../infrastructure/email/emailService';

const handleAuthRequest = async (req: Request, res: Response) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({message: "Email is requires"})
    }
    try {
        const token = jwt.sign({email}, config.jwtSecret, {expiresIn: '15m'});
        await sendSignInEmail(email, token);
        return res.status(200).json({message: 'Sign-in link sent succsessfully.'});
    } catch(error) {
       console.error('Error in auth request:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
};

const verifyTokenAndSetCookies = (req: Request, res: Response) => {
   const {token} = req.query;

   if (!token || typeof token !== 'string') {
        return res.status(400).send('Token is required.');
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            maxAge: 15 * 60 * 1000,
            sameSite: 'lax',
        });
        return res.redirect(config.frontendUrl);
    } catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(401).send('invalid tokens.')
    }
};

export {
    handleAuthRequest as handleSignup,
    handleAuthRequest as handleSignin,
    verifyTokenAndSetCookies,
};


