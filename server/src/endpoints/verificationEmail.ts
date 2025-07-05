import express, {Request, Response} from 'express'
import brevo from '@getbrevo/brevo'
import dotenv from 'dotenv'
import otpGenerator from 'otp-generator'

const router=express.Router()
dotenv.config()

router.post('/',async(req:Request,res:Response): Promise<any>=>{
    
    const {email}=req.body;
    const brevoKey=process.env.BREVO_API_KEY;
    const senderEmail=process.env.SENDER_EMAIL;
    const otpNumber=otpGenerator.generate(6,{lowerCaseAlphabets:false, upperCaseAlphabets:false, specialChars:false});

    //making sure email is valid string and exists

    if(!email || typeof email!=='string'){
        return res.status(400).json({error: 'Valid email is required.'});
    }

    //making sure BREVO_API_KEY is present in env variable and that env fileis loaded properly (that we have dotenv.config())
    //after the check brevoKey automatically becomes a string

    if(!brevoKey){
        return res.status(400).json({error: 'Brevo API key is not set.'});
    }

    const apiInstance=new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, brevoKey);

    try{
        const sendSmtpEmail=new brevo.SendSmtpEmail();
        sendSmtpEmail.to=[{email}];
        sendSmtpEmail.sender={email:`${senderEmail}`};
        sendSmtpEmail.subject='Verification Code';
        sendSmtpEmail.htmlContent=`<p>Your verification code is: <strong>${otpNumber}</strong></p>`;

        const response=await apiInstance.sendTransacEmail(sendSmtpEmail);
        
        res.json({code:otpNumber})
    }
    catch(error){
        console.error('Error sending email:', error)
        res.status(500).json({error:'Failed to send email'})
    }

})

export default router

