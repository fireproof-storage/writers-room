import { useFireproof } from 'use-fireproof'
import { Link } from 'react-router-dom'
import { TopicDoc } from '../pages/Topic'
import { useState } from 'react'
import { AutoFocusInput } from './AutoFocusInput'

export function Topics() {
  const { database, useLiveQuery } = useFireproof('topics')
  const [isCreating, setIsCreating] = useState(false)
  const [topicName, setTopicName] = useState('')

  const topics = useLiveQuery(
    (doc, emit) => {
      if (doc.type === 'topic') {
        emit(doc.title)
      }
    },
    { descending: false }
  ).docs as TopicDoc[]

  const handleCreateClick = async () => {
    const topicDoc: TopicDoc = {
      type: 'topic',
      title: topicName,
      created: Date.now(),
      updated: Date.now()
    }
    await database.put(topicDoc)
    setIsCreating(false)
    setTopicName('')
  }
  return (
    <div className="py-2">
      <h2 className="text-2xl text-bold">Topics</h2>
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
                value={topicName}
                isActive={isCreating}
                onChange={e => setTopicName(e.target.value)}
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
                Create new topic
              </span>
            </>
          )}
        </li>
        {topics.map(doc => (
          <li key={doc._id} className="p-2 text-gray-500">
            <Link
              to={`/topic/${doc._id}`}
              className="block text-xs hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-2"
            >
              <span className="block font-bold">{doc.title}</span>
              <span className="block">{new Date(doc.updated).toLocaleString()}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
