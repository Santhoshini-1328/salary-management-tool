import { Routes, Route, Navigate } from 'react-router-dom'

import DashboardPage from './pages/DashboardPage'
import EmployeesPage from './pages/EmployeesPage'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/employees" element={<EmployeesPage />} />
      </Route>
    </Routes>
  )
}

export default App