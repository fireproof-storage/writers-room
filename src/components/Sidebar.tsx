import { useEffect, useState } from 'react'
import { useFireproof } from 'use-fireproof'
import { connect } from '@fireproof/ipfs'
import { Login } from './Login'
import { Topics } from './Topics'
import { Characters } from './Characters'
import { APIKey } from './APIKey'

export function Sidebar() {
  const { database } = useFireproof('topics')
  const [authorized, setAuthorized] = useState(false)
  const [userEmail, setUserEmail] = useState(localStorage.getItem('user-email') || '')
  const cx = connect.ipfs(database)

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

  const onKeySet = (key: string) => {
    localStorage.setItem('api-key', key)
  }

  const apiKeyPresent = Boolean(localStorage.getItem('api-key'))

  const placeholder = (localStorage.getItem('api-key') || '').substring(0, 10) + '...'

  return (
    <div className="w-1/4 p-4 dark:bg-gray-900 bg-slate-200">
      <Login
        onLogin={onLogin}
        accountClicked={() => database.openDashboard()}
        placeholder={userEmail}
        authorized={authorized}
      />
      
      <APIKey
        onKeySet={onKeySet}
        placeholder={placeholder}
        keyPresent={apiKeyPresent}
      />

      <Characters />
      <Topics />
      

    </div>
  )
}
