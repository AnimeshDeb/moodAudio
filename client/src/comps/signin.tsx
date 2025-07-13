import { SignIn } from '@clerk/clerk-react';
import signupImg from '../images/headphonesGlow.jpg';
export default function Signin() {
  return (
    <div>
      <div className="w-screen min-w-[400px] flex flex-col lg:flex-row min-h-screen bg-[#0A0F1C] text-[#E2E8F0] overflow-y-auto relative">
        {/* Left Side - Text and Clerk Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#1A1F2B] p-6 z-10 relative">
          <div className="text-center mb-6 px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {' '}
              Sign in to moodVid
            </h1>
          </div>
          <div className="w-full flex justify-center items-center max-w-sm px-4">
            <SignIn
              path="/signin"
              routing="path"
              signUpUrl="/signup"
              forceRedirectUrl="/home"
            />
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="relative flex w-full lg:w-1/2">
          <img
            src={signupImg}
            alt="Headphones glowing in orange light"
            className="w-full h-full object-cover"
          />
          {/* Responsive Gradient Overlay */}
          <div
            className="
          absolute 
          top-0 left-0 
          w-full h-full 
          bg-gradient-to-b from-[#1A1F2B] to-transparent
          lg:bg-gradient-to-r lg:from-[#0A0F1C] lg:to-transparent
          pointer-events-none
        "
          />
        </div>
      </div>
    </div>
  );
}
