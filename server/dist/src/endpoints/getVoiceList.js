import 'dotenv/config';
import express from 'express';
import { fetchAllVoices } from '../util/fetchAllVoices.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const xi_voice_api_key = process.env.XI_ALLVOICE_API_KEY;
        if (!xi_voice_api_key) {
            return res.status(400).json({ error: 'API key missing.' });
        }
        const voices = await fetchAllVoices(xi_voice_api_key);
        res.json({ payload: voices }); //returning all voices 
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
export default router;
