import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Topic } from './pages/Topic'
import { Sidebar } from './components/Sidebar'
import { Item } from './pages/Item'

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
    { path: '/topic/:id', component: Topic },
    { path: '/item/:id', component: Item },
    { path: '/', component: Home }
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
