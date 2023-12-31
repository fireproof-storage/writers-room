import { useFireproof } from 'use-fireproof'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AutoFocusInput } from './AutoFocusInput'
// import { StorylineDoc } from '../fireproof'
import { useParams } from 'react-router-dom'
import { actsForStoryline, ActDoc } from '../fireproof'
import { MapFn } from '@fireproof/core'

export function Acts({ storylineId }: { storylineId: string }) {
  const { world } = useParams()
  const { database, useLiveQuery } = useFireproof(world)

  const [isCreating, setIsCreating] = useState(false)
  const [actName, setActName] = useState('')

  const acts = useLiveQuery(actsForStoryline as MapFn, { key: storylineId, descending: false })
    .docs as ActDoc[]

  const handleCreateClick = async () => {
    const actDoc: ActDoc = {
      type: 'act',
      storylineId,
      title: actName,
      number: acts.length + 1,
      updated: Date.now(),
      created: Date.now()
    }
    await database.put(actDoc)
    setIsCreating(false)
    setActName('')
  }

  console.log('acts', acts)

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
              to={`/${world}/act/${doc._id}`}
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
