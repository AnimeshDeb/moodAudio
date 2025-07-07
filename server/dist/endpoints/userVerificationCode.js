import express from 'express';
import { Redis } from '@upstash/redis';
const router = express.Router();
router.post('/', async (req, res) => {
    try {
        const { enteredOtp, email } = req.body;
        if (!enteredOtp || !email) {
            return res.status(400).json({ error: 'Missing email or otp.' });
        }
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        const storedOtp = await redis.get(`otp:${email.toLowerCase()}`);
        if (storedOtp == enteredOtp) {
            res.json({ otpMatch: true });
        }
        else {
            res.json({ otpMatch: false });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
export default router;
