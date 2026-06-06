import { Routes, Route } from 'react-router'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Research from './pages/Research'
import About from './pages/About'
import Life from './pages/Life'

export default function App() {
  return (
    <LanguageProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/research" element={<Research />} />
          <Route path="/about" element={<About />} />
          <Route path="/life" element={<Life />} />
        </Routes>
      </Layout>
    </LanguageProvider>
  )
}
