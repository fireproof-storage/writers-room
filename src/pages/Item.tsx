// pages/Item.tsx

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { ItemDoc } from '../components/Items'
import { TopicDoc } from './Topic'

export function Item() {
  const { id } = useParams<{ id: string }>()
  const { database } = useFireproof('topics')
  const [item, setItem] = useState<ItemDoc | null>(null)

  useEffect(() => {
    const fetchItem = async () => {
      const doc = await database.get(id!)  as ItemDoc
      doc.topic = await database.get(doc.topicId as string) as TopicDoc
      if (doc.type === 'item') {
        setItem(doc)
      }
    }
    fetchItem()
  }, [id, database])

  if (!item) {
    return <div>Loading...</div>
  }

const topicId = item.topicId

  return (
    <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
      <Link to={`/topic/${topicId}`} className="text-white">← back to {item.topic?.title}</Link>
      <h2 className="text-4xl font-bold mb-2">{item.name}</h2>
      <p className="text-lg mb-2">{item.description}</p>
      <p className="text-sm">Created: {new Date(item.created).toLocaleString()}</p>
      <p className="text-sm">Updated: {new Date(item.updated).toLocaleString()}</p>
    </div>
  )
}
