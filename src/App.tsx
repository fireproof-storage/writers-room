import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Storyline } from './pages/Storyline'
import { Sidebar } from './components/Sidebar'
import { Act } from './pages/Act'
import { Character } from './pages/Character'
import { Scene } from './pages/Scene'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function RedirectToDefault() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/default')
  }, [navigate])

  return null
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen dark:bg-gray-950 bg-slate-200 text-slate-800 dark:text-slate-200">
      <Sidebar />
      <div className="MainContent flex-1 p-4 ">{children}</div>
    </div>
  )
}

function App() {
  const routes = [
    { path: '/:world/character/:id', component: Character },
    { path: '/:world/storyline/:id', component: Storyline },
    { path: '/:world/act/:id', component: Act },
    { path: '/:world/scene/:id', component: Scene },
    { path: '/:world', component: Home },
    { path: '/', component: RedirectToDefault }
  ]

  return (
    <>
      <Header />
      <Routes>
        {routes.map(({ path, component }, index) => (
          <Route
            key={index}
            path={path}
            element={<Layout>{React.createElement(component)}</Layout>}
          />
        ))}
      </Routes>
    </>
  )
}

export default App
