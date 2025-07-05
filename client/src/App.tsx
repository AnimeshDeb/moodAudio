import Signup from './comps/login'
import VerificationCode from './comps/verificationCode'
import { Route, Routes } from 'react-router-dom'

import './App.css'

function App() {
return(
  <Routes>
    <Route path="/signup" element={<Signup/>} />
    <Route path="/verificationCode" element={<VerificationCode/>}/>
  </Routes>
)

}

export default App
