import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Form,
} from '@/components/ui/form';
import {Alert, AlertDescription} from '@/components/ui/alert'
import { useState } from 'react';
// import { Terminal } from 'lucide-react';

export default function Otp() {
  const [codeWarning, setCodeWarning]=useState(false)
  const location = useLocation();
  const navigate=useNavigate()
  const { email } = location.state || {};

  const formSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  });

  return (
    <div className="bg-[#0A0F1C] w-[100vw] min-w-[400px] min-h-screen flex justify-center items-center text-[#E2E8F0] p-4">
      <div className="w-full max-w-md bg-[#1A1F2B] rounded-lg p-6 flex justify-center items-center flex-col gap-2">
        <p className="mb-4  flex flex-col text-[#3DDC97]">
          Look for our email in your inbox or spam. Enter the code below.
        </p>
        {codeWarning && 
        
        <Alert variant="destructive" className='bg-[#1A1F2B] flex justify-center items-center text-[#FF6B81] border border-[#FF6B81]'>
          <AlertDescription>
            Wrong code entered. Try again.
          </AlertDescription>
        </Alert>
        }
        <Form {...form}>
          <form onSubmit={form.handleSubmit(async (data) => {
            const response=await fetch('https://mood-audio.vercel.app/verificationCode',{
                        method: 'POST',
                        headers:{
                          'Content-Type':'application/json',
                        },
                        body: JSON.stringify({ enteredOtp:data.otp, email:email}),
            })
            const resData=await response.json()
            if(resData.otpMatch==true){
              navigate('/home')
            }
            
            else{
              setCodeWarning(true)
            }
          })}>
            <Controller
              name="otp"
              control={form.control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <div>
              <button
                type="submit"
                className="mt-4 bg-[#6C63FF] hover:bg-[#FF6B81] text-white rounded-lg px-6 py-3 font-semibold cursor-pointer transition duration-200"
              >
                Verify Code
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
