import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import { ResumeProvider } from './context/ResumeContext.jsx'
import Home from './pages/Home.jsx'
import Builder from './pages/Builder.jsx'
import Preview from './pages/Preview.jsx'

export default function App() {
  return (
    <ResumeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </ResumeProvider>
  )
}
