import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from "./Home"
import './styles/index.css'
 
const App=()=>{

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App