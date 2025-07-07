import Signup from './comps/signup';
import Otp from './comps/userVerificationCode';
import { Route, Routes } from 'react-router-dom';
import Home from './comps/home';
import Signin from './comps/signin';

import './App.css';

function App() {
return(
  <Routes>
    <Route path="/signup/*" element={<Signup/>} />
    <Route path="/signin/*" element={<Signin/>}/>
    <Route path="/otp" element={<Otp/>}/>
    <Route path="/home" element={<Home/>}/>
  </Routes>
)

}

export default App
