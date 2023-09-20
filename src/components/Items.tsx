import { useFireproof } from 'use-fireproof'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AutoFocusInput } from './AutoFocusInput'

export type ItemDoc = {
  _id?: string
  topicId: string
  name: string
  description?: string
  created: number
  updated: number
  type: 'item'
}

export function Items({ topicId }: { topicId: string }) {
  const { database, useLiveQuery } = useFireproof('gallery')
  const [isCreating, setIsCreating] = useState(false)
  const [itemName, setItemName] = useState('')

  const items = useLiveQuery(
    (doc, emit) => {
      if (doc.type === 'item') {
        emit(doc.topicId)
      }
    },
    { descending: false }
  ).docs as ItemDoc[]

  const handleCreateClick = async () => {
    const topicDoc: ItemDoc = {
      type: 'item',
      topicId,
      name: itemName,
      created: Date.now(),
      updated: Date.now()
    }
    await database.put(topicDoc)
    setIsCreating(false)
    setItemName('')
  }
  return (
    <div className="py-2">
      <h2 className="text-xl text-bold">Items</h2>
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
                value={itemName}
                isActive={isCreating}
                onChange={e => setItemName(e.target.value)}
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
                Create new item
              </span>
            </>
          )}
        </li>
        {items.map(doc => (
          <li key={doc._id} className="p-2 text-gray-500">
            <Link
              to={`/item/${doc._id}`}
              className="block hover:bg-gray-100dark: hover:bg-gray-800 rounded px-2"
            >
              <span className="block font-bold">{doc.name}</span>
              <span className="block text-xs pb-2">{new Date(doc.updated).toLocaleString()}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
