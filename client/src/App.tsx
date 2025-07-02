import Signup from './comps/login'
import { Route, Routes } from 'react-router-dom'
import './App.css'

function App() {
return(
  <Routes>
    <Route path="/login" element={<Signup/>} />
  </Routes>
)

}

export default App
