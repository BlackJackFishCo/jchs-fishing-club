import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Species from './pages/Species.jsx'
import Volunteer from './pages/Volunteer.jsx'
import Calendar from './pages/Calendar.jsx'
import ClubRecords from './pages/ClubRecords.jsx'
import Tournament from './pages/Tournament.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/species" element={<Species />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/records" element={<ClubRecords />} />
        <Route path="/tournament" element={<Tournament />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
