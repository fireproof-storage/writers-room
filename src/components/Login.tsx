import { useState } from 'react'

export function Login({
  onLogin,
  placeholder,
  authorized,
  accountClicked,
}: {
  authorized: boolean
  placeholder?: string,
  accountClicked: () => void,
  onLogin: (email: `${string}@${string}`) => void
}) {
  const [email, setEmail] = useState<`${string}@${string}`>()
  const [didSubmit, setDidSubmit] = useState(false)
  
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDidSubmit(true)
    if (email) onLogin(email)
  }
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value as `${string}@${string}`)
  }
  return (
    <div className="bg-slate-500 rounded p-2">
      {authorized ? (
        <button className="text-xs"
        title="Open this database in the Fireproof dashboard"
        onClick={accountClicked}
        >
          Logged in as <span className="italic">{placeholder}</span>
        </button>
      ) : didSubmit ? (
        <p className="text-xs">
          Please check your email at <span className="italic">{email}</span> for a verification
          message from web3.storage. If you are logging into an existing account, please log in on
          your original device as well, to allow account certification. This process can take up to
          a minute, make a tea (or{' '}
          <a href="https://github.com/web3-storage/w3clock/issues/4">add websockets here</a>).
        </p>
      ) : (
        <>
          <h2 className="text-slate-900 px-1">Login to save:</h2>
          <form onSubmit={onSubmit}>
            <input
              className="p-1 mt-1 w-full text-slate-900"
              type="text"
              value={email}
              placeholder={placeholder || 'email@example.com'}
              onChange={onChange}
            />
            <button
              className="p-1 mt-1 w-full bg-slate-600 hover:bg-slate-700 rounded text-white"
              type="submit"
            >
              Login
            </button>
          </form>
        </>
      )}
    </div>
  )
}
