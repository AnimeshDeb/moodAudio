// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import signup from '../images/headphonesGlow.jpg';
// import { useNavigate } from 'react-router-dom';

import { SignUp } from '@clerk/clerk-react';
import signupImg from '../images/headphonesGlow.jpg'; // Make sure path is correct

export default function Signup() {
  return (
    <div className="w-screen min-w-[400px] flex flex-col lg:flex-row min-h-screen bg-[#0A0F1C] text-[#E2E8F0] overflow-hidden">
      
      {/* Left Side - Text and Clerk Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#1A1F2B] p-6 border border-[#2D3748]">
        <div className="text-center mb-6 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to [muse.io]</h1>
        </div>
        <div className="w-full flex justify-center items-center max-w-sm px-4">
          <SignUp
            path="/signup"
            routing="path"
            signInUrl="/signin"
            forceRedirectUrl="/home"
            appearance={{
              elements: {
                card: "bg-white shadow-md",
                formButtonPrimary: "bg-[#6C63FF] hover:bg-[#FF6B81]",
              },
            }}
          />
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex w-full lg:w-1/2">
        <img
          src={signupImg}
          alt="Headphones glowing in orange light"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}


// export default function Signup() {
//   const navigate = useNavigate();
//   const formSchema = z.object({
//     email: z.string().email({ message: 'Please enter a valid email!' }),
//   });

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: '',
//     },
//   });

//   return (
//     <div className="w-[100vw] min-w-[400px] overflow-hidden flex flex-col md:flex-row min-h-screen bg-[#0A0F1C] text-[#E2E8F0]">
//       {/* Left side - Form */}
//       <div className="w-full md:w-1/2 flex justify-center items-center bg-[#1A1F2B] border border-[#2D3748]  p-6 shadow-lg">
//         <div className="w-full px-6 md:px-[100px] flex flex-col gap-[50px] items-center">
//           <div className="w-full max-w-[700px] flex flex-col gap-[30px]">
//             <h1 className="text-2xl font-bold text-center">
//               Welcome to [muse.io]
//             </h1>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(async (data) => {
//                   try {
//                     const response = await fetch(
//                       'http://localhost:3000/verificationEmail',
//                       {
//                         method: 'POST',
//                         headers: {
//                           'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({ email: data.email }),
//                       }
//                     );
//                     const resData = await response.json();
//                     if (resData.eStatus == 'success') {
//                       navigate('/otp', {
//                         state: { email: data.email },
//                       });
//                     }
//                   } catch (error) {
//                     console.error(error);
//                   }
//                 })}
//                 className="flex flex-col gap-[20px] w-full"
//               >
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email</FormLabel>
//                       <FormControl>
//                         <Input
//                           className="w-full border-[#2D3748] bg-[#1A1F2B] text-[#E2E8F0] placeholder:text-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#3DDC97] focus-visible:border-[#6C63FF]"
//                           placeholder="Enter your email"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <div>
//                   <button className="bg-[#6C63FF] hover:bg-[#FF6B81] text-white rounded-lg px-6 py-3 font-semibold cursor-pointer transition duration-200">
//                     Sign Up
//                   </button>
//                 </div>

//                 <p>
//                   Have an account?{' '}
//                   <a
//                     href="/login"
//                     className="text-[#6C63FF] hover:text-[#FF6B81] font-semibold underline underline-offset-2 cursor-pointer"
//                   >
//                     Login
//                   </a>
//                 </p>
//               </form>
//             </Form>
//           </div>
//         </div>
//       </div>

//       {/* Right side - Image */}
//       <div className="w-full md:w-1/2 flex justify-center items-center bg-[#1A1F2B]">
//         <img
//           src={signup}
//           alt="Headphones glowing in orange light"
//           className="w-full h-full object-cover rounded-b-lg md:rounded-r-lg md:rounded-bl-none"
//         />
//       </div>
//     </div>
//   );
// }
