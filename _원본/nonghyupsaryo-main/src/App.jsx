import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
import Home from './pages/Home'
import VolumeOverview from './pages/VolumeOverview'
import PartPage from './pages/PartPage'
import Schedule from './pages/Schedule'
import Labs from './pages/Labs'
import ToolsHome from './pages/ToolsHome'
import ToolPage from './pages/ToolPage'
import PromptLab from './pages/PromptLab'
import About from './pages/About'
import InstructorIntro from './pages/InstructorIntro'
import CompanyIntro from './pages/CompanyIntro'
import Appendix from './pages/Appendix'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vol/:volId" element={<VolumeOverview />} />
          <Route path="/vol/:volId/part/:partNum" element={<PartPage />} />
          <Route path="/schedule/:volId" element={<Schedule />} />
          <Route path="/labs/:volId" element={<Labs />} />
          <Route path="/labs/:volId/:day" element={<Labs />} />
          <Route path="/tools" element={<ToolsHome />} />
          <Route path="/tools/prompt" element={<Navigate to="/tools/prompt/learn" replace />} />
          <Route path="/tools/prompt/:section" element={<PromptLab />} />
          <Route path="/tools/:toolId" element={<ToolPage />} />
          <Route path="/tools/:toolId/:section" element={<ToolPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/instructor" element={<InstructorIntro />} />
          <Route path="/about/company" element={<CompanyIntro />} />
          <Route path="/appendix" element={<Appendix />} />
          <Route path="/appendix/:catId" element={<Appendix />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProgressProvider>
    </AuthProvider>
  )
}
