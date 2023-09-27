import { useState } from 'react'
import {
  useParams
  // , useNavigate
} from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { Items } from '../components/Items'
import { DescriptionEditor } from '../components/DescriptionEditor'

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

  const { database, useLiveQuery } = useFireproof('topics')
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
      <DescriptionEditor
        topic={topic}
        database={database}
        isEditingDescription={isEditingDescription}
        setIsEditingDescription={setIsEditingDescription}
      />
      <Items topicId={id!} />
    </div>
  )
}
