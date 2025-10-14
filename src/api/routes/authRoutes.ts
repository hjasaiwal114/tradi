import {Router} from 'express';
import {
   handleSignup,
   handleSignin,
   verifyTokenAndSetCookies,
}from '../controllers/authController';

const router = Router();

router.post('/signup', handleSignup);
router.post('/singin', handleSignin);
router.get('/signin/post', verifyTokenAndSetCookies);

export default router;
