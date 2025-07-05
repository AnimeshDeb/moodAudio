import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import signup from '../images/headphonesGlow.jpg';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const formSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email!' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <div className="w-[100vw] overflow-hidden flex flex-col md:flex-row min-h-screen bg-[#0A0F1C] text-[#E2E8F0]">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-[#1A1F2B] border border-[#2D3748]  p-6 shadow-lg">
        <div className="w-full px-6 md:px-[100px] flex flex-col gap-[50px] items-center">
          <div className="w-full max-w-[700px] flex flex-col gap-[30px]">
            <h1 className="text-2xl font-bold text-center">
              Welcome to [muse.io]
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (data) => {
                  try {
                    const response = await fetch(
                      'http://localhost:3000/verificationEmail',
                      {
                        method: 'POST',
                        headers:{
                          'Content-Type':'application/json',
                        },
                        body: JSON.stringify({ email: data.email }),
                      }
                    );
                    const resData = await response.json();
                    navigate('/verificationCode', {
                      state: { email: data, correctCode: resData },
                    });
                  } catch (error) {
                    console.error(error);
                  }
                })}
                className="flex flex-col gap-[20px] w-full"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full border-[#2D3748] bg-[#1A1F2B] text-[#E2E8F0] placeholder:text-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#3DDC97] focus-visible:border-[#6C63FF]"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <button className="bg-[#6C63FF] hover:bg-[#FF6B81] text-white rounded-lg px-6 py-3 font-semibold cursor-pointer transition duration-200">
                    Sign Up
                  </button>
                </div>

                <p>
                  Have an account?{' '}
                  <a
                    href="/login"
                    className="text-[#6C63FF] hover:text-[#FF6B81] font-semibold underline underline-offset-2 cursor-pointer"
                  >
                    Login
                  </a>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-[#1A1F2B]">
        <img
          src={signup}
          alt="Headphones glowing in orange light"
          className="w-full h-full object-cover rounded-b-lg md:rounded-r-lg md:rounded-bl-none"
        />
      </div>
    </div>
  );
}
