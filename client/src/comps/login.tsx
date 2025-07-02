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

export default function Signup() {
  const formSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email!' }),
    password: z
      .string()
      .min(8, { message: 'Password must be greater than 7 characters' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character',
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className="w-[100vw] overflow-hidden flex flex-col md:flex-row min-h-screen">
      
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-300/20 backdrop-blur-md border border-white/30 rounded-lg p-6 shadow-lg">
        <div className="w-full px-6 md:px-[100px] flex flex-col gap-[50px] items-center">
          <div className="w-full max-w-[700px] flex flex-col gap-[30px]">
            <h1 className="text-2xl font-bold text-center">Welcome to [muse.io]</h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => console.log(data))}
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
                          className="w-full border-blue-400 focus-visible:ring-blue-600"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full border-blue-400 focus-visible:ring-blue-600"
                          placeholder="Enter a password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-300/20">
        <img
          src={signup}
          alt="Headphones glowing in orange light"
          className="w-full h-full object-cover rounded-b-lg md:rounded-r-lg md:rounded-bl-none"
        />
      </div>
    </div>
  );
}
