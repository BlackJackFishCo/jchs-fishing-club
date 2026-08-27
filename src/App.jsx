import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Species from './pages/Species.jsx'
import Volunteer from './pages/Volunteer.jsx'
import Tournament from './pages/Tournament.jsx'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/species" element={<Species />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/tournament" element={<Tournament />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
