import Signup from './comps/login'
import Otp from './comps/userVerificationCode'
import { Route, Routes } from 'react-router-dom'

import './App.css'

function App() {
return(
  <Routes>
    <Route path="/signup" element={<Signup/>} />
    <Route path="/otp" element={<Otp/>}/>
  </Routes>
)

}

export default App
