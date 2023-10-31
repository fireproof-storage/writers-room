import { useFireproof } from 'use-fireproof'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AutoFocusInput } from './AutoFocusInput'
import { StorylineDoc } from '../pages/Storyline'

export type ActDoc = {
  _id?: string
  storylineId: string
  storyline?: StorylineDoc
  name: string
  description?: string
  created: number
  updated: number
  type: 'act'
}

export function Acts({ storylineId }: { storylineId: string }) {
  const { database, useLiveQuery } = useFireproof('topics')
  const [isCreating, setIsCreating] = useState(false)
  const [actName, setActName] = useState('')

  const acts = useLiveQuery(
    (doc, emit) => {
      if (doc.type === 'act' && doc.storyline) {
        console.log('got one', doc.storyline, doc.number)
        emit([doc.storyline, doc.number])
      }
    },
    { descending: false }
  ).docs as ActDoc[]

  const handleCreateClick = async () => {
    const actDoc: ActDoc = {
      type: 'act',
      storylineId,
      name: actName,
      created: Date.now(),
      updated: Date.now()
    }
    await database.put(actDoc)
    setIsCreating(false)
    setActName('')
  }

  console.log({acts})

  return (
    <div className="py-2">
      <h2 className="text-xl text-bold">Acts</h2>
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
                value={actName}
                isActive={isCreating}
                onChange={e => setActName(e.target.value)}
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
                Create new act
              </span>
            </>
          )}
        </li>
        {acts.map(doc => (
          <li key={doc._id} className="p-2 text-gray-500 flex justify-between items-center">
            <Link
              to={`/item/${doc._id}`}
              className="block hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 flex-grow"
            >
              <span className="font-bold">{doc.title}</span>
            </Link>
            <span className="text-xs pb-2">{new Date(doc.updated).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
