import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TotalsPannel from './components/TotalsPanel'
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/total' element={<TotalsPannel />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
