import { useEffect, useState } from 'react'
import { useFireproof } from 'use-fireproof'
import {connect} from '@fireproof/ipfs'
import { Login } from './Login'
import { Topics } from './Topics'

export function Sidebar() {
  const {database}  = useFireproof('topics')
  const [authorized, setAuthorized] = useState(false)
  const [userEmail, setUserEmail] = useState(localStorage.getItem('user-email') || '')
  const cx=connect.ipfs(database)

  useEffect(() => {
    cx.ready.then(() => {
      setAuthorized(!!cx.authorized)
    })
  }, [])

  const onLogin = (email: `${string}@${string}`) => {
    cx.authorize(email).then(() => {
      setAuthorized(true)
      localStorage.setItem('user-email', email)
      setUserEmail(email)
    })
  }

  return (
    <div className="w-1/4 p-4 dark:bg-gray-900 bg-slate-200">
      <Login
        onLogin={onLogin}
        accountClicked={() => database.openDashboard()}
        placeholder={userEmail}
        authorized={authorized}
      />
      <Topics />
    </div>
  )
}
