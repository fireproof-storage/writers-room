import { useFireproof } from 'use-fireproof'
import { Link } from 'react-router-dom'
import { CharacterDoc } from '../pages/Character'
import { useState } from 'react'
import { AutoFocusInput } from './AutoFocusInput'

export function Characters() {
  const { database, useLiveQuery } = useFireproof('topics')
  const [isCreating, setIsCreating] = useState(false)
  const [characterName, setCharacterName] = useState('')

  const characters = useLiveQuery(
    (doc, emit) => {
      if (doc.type === 'character') {
        emit(doc.name)
      }
    },
    { descending: false }
  ).docs as CharacterDoc[]

  const handleCreateClick = async () => {
    const characterDoc: CharacterDoc = {
      type: 'character',
      name: characterName,
      created: Date.now(),
      updated: Date.now()
    }
    await database.put(characterDoc)
    setIsCreating(false)
    setCharacterName('')
  }
  return (
    <div className="py-2">
      <h2 className="text-2xl text-bold">Characters</h2>
      <ul className="list-inside list-none">
        <li key="add" className="p-2">
          {isCreating ? (
            <form
              className="flex items-center"
              onSubmit={e => {
                e.preventDefault()
                handleCreateClick()
              }}
            >
              <AutoFocusInput
                value={characterName}
                isActive={isCreating}
                onChange={e => setCharacterName(e.target.value)}
                className="bg-slate-300 p-1 mr-2 text-xs text-black flex-grow"
              />
              <button type="submit" className="ml-2">
                ✔️
              </button>
            </form>
          ) : (
            <>
              <span className="inline-block text-slate-700">+</span>
              <span onClick={() => setIsCreating(true)} className="inline-block ml-2">
                Create new character
              </span>
            </>
          )}
        </li>
        {characters.map(doc => (
          <li key={doc._id} className="p-2 text-gray-500">
            <Link
              to={`/character/${doc._id}`}
              className="block text-xs hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-2"
            >
              <span className="block font-bold">{doc.name}</span>
              <span className="block">{new Date(doc.updated).toLocaleString()}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
