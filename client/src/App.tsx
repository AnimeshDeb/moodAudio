import Signup from './comps/signup';
import Otp from './comps/userVerificationCode';
import { Route, Routes } from 'react-router-dom';
import Home from './comps/home';
import Signin from './comps/signin';
import { SignedIn } from '@clerk/clerk-react';
import { RedirectToSignIn } from '@clerk/clerk-react';
import { SignedOut } from '@clerk/clerk-react';
import LandingPage from './comps/landingpage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/signup/*" element={<Signup />} />
      <Route path="/signin/*" element={<Signin />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/" element={<LandingPage />}/>

      <Route
        path="/home"
        element={
          <>
          <SignedIn>
            <Home />
          </SignedIn>
          <SignedOut>
          <RedirectToSignIn/>
          </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

export default App;
