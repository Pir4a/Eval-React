
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import UserPage from './pages/UserPage'
import NotFound from './pages/NotFound'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
