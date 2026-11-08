import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Logo } from './components/Logo'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Repositories from './pages/Repositories'
import Deployments from './pages/Deployments'
import Settings from './pages/Settings'

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return <div className="grid min-h-dvh place-items-center"><div className="animate-pulse"><Logo size={40} /></div></div>
  if (!user) return <Login />
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="repositories" element={<Repositories />} />
        <Route path="deployments" element={<Deployments />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Overview />} />
      </Route>
    </Routes>
  )
}
