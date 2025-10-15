
import {Request, Response} from 'express';

interface AuthenticatedRequest extends Request {
    user?: {email: string};
}

const getMyProfile = (req: AuthenticatedRequest, res:Response) => {
     if (req.user) {
        res.status(200).json({
            message: 'Profile fetched successfully',
            data: {
                email: req.user.email,
            },
        });
    } else {
        res.status(401).json({message: 'Not authorized' });
    }
};

