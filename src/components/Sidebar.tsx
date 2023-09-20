import { useEffect, useState } from 'react'
import { useFireproof } from 'use-fireproof'
import { Login } from './Login'
import { Topics } from './Topics'

export function Sidebar() {
  const { database } = useFireproof('smart-book')
  const [, setAuthorized] = useState(false)
  const cx = database.connect('gallery')

  useEffect(() => {
    cx.ready.then(() => {
      setAuthorized(!!cx.authorized)
    })
  }, [])

  const onLogin = (email: `${string}@${string}`) => {
    cx.authorize(email).then(() => {
      setAuthorized(true)
    })
  }

  return (
    <div className="w-1/4 p-4 dark:bg-gray-900 bg-slate-200">
      <Login onLogin={onLogin} />
      <Topics />
    </div>
  )
}