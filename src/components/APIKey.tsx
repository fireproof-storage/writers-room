import { useState } from 'react'

export function APIKey({
  onKeySet,
  placeholder,
  keyPresent
}: {
  keyPresent: boolean
  placeholder?: string
  onKeySet: (key: string) => void
}) {
  const [key, setKey] = useState<string>()

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (key) onKeySet(key)
  }
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value)
  }
  return (
    <div className="bg-slate-500 rounded p-2 mt-1">
      {keyPresent ? (
        <a className="text-xs" href="https://platform.openai.com/account/api-keys">
          API Key set as <span className="italic">{placeholder}</span>
        </a>
      ) : (
        <>
          <h2 className="text-slate-900 px-1">
            <a href="https://platform.openai.com/account/api-keys">
              Enter OpenAI API Key to generate:
            </a>
          </h2>
          <form onSubmit={onSubmit}>
            <input
              className="p-1 mt-1 w-full text-slate-900"
              type="text"
              value={key}
              placeholder={placeholder || 'sk-...'}
              onChange={onChange}
            />
            <button
              className="p-1 mt-1 w-full bg-slate-600 hover:bg-slate-700 rounded text-white"
              type="submit"
            >
              Set Key
            </button>
          </form>
        </>
      )}
    </div>
  )
}

