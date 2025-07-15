import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import 'dotenv/config';
import express from 'express';
import { Request, Response } from 'express';
import { fetchAllVoices } from '../util/fetchAllVoices.js';
const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const xi_voice_api_key = process.env.XI_ALLVOICE_API_KEY;

    //We only are interested in the voices property so voiceObject is basically saying that
    //voices property wil have fields like voice_id, name, preview_url (which we care about only) and
    //also other fields (which we don't care about) so for these we say that the property will be of type string but the value we don't know the type.
    //


    type VoiceObject={
      voice_id: string;
      name: string;
      preview_url?:string;
      [key:string]:unknown;
    }


    //Because the api response will give us other fields besides voices{} we say that the response will 
    //give us a field known as voices of type voiceObject which we defined before and also other fields which
    //we don't care about.

    type DataResponse={
      voices:VoiceObject[];
      [key:string]:unknown;
    }


    if (!xi_voice_api_key) {
      return res.status(400).json({ error: 'API key missing.' });
    }
   
    const voices=await fetchAllVoices(xi_voice_api_key);
    res.json({payload:voices})//returning all voices 
    
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
