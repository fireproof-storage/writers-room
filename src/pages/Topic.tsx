import {  useState } from 'react'
import {
  useParams
  // , useNavigate
} from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { Items } from '../components/Items'

export type TopicDoc = {
  _id?: string
  title: string
  description?: string
  created: number
  updated: number
  type: 'topic'
}

export function Topic() {
  // const navigate = useNavigate() // Initialize useHistory hook
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [newDescription, setNewDescription] = useState('')

  const { database, useLiveQuery } = useFireproof('gallery')
  const { id } = useParams()

  const topics = useLiveQuery('_id', { key: id })
  const [topic] = topics.docs as TopicDoc[]

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">{topic?.title}</h1>
      </div>
      <div className="mb-2">
        <span className="text-sm text-gray-500">
          Created: {new Date(topic?.created).toLocaleString()}
        </span>
        <span className="ml-4 text-sm text-gray-500">
          Updated: {new Date(topic?.updated).toLocaleString()}
        </span>
      </div>
      {isEditingDescription || !topic?.description ? (
        <form
          onSubmit={e => {
            e.preventDefault()
            topic.description = newDescription
            topic.updated = Date.now()
            database.put(topic)
            setIsEditingDescription(false)
            setNewDescription('')
          }}
        >
          <div className="w-full flex p-2">
            <label className="block text-sm font-bold mb-2 pr-2" htmlFor="description">
              Edit description:
            </label>
            <input
              id="description"
              className="border-2 border-gray-300 p-1 mr-2 text-sm text-black w-full rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
            />
            <button className="w-8 h-8" type="submit">
              ✔️
            </button>
          </div>
        </form>
      ) : (
        <div
          onClick={() => {
            setNewDescription(topic?.description?.toString() || '')
            setIsEditingDescription(true)
          }}
          className="prose prose-slate dark:prose-invert"
        >
          <p>{topic?.description}</p>
        </div>
      )}
      <Items topicId={id!} />
    </div>
  )
}
