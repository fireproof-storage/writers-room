// pages/Item.tsx

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { ActDoc } from '../components/Acts'
// import { StorylineDoc } from './Storyline'
import { InlineEditor } from '../components/InlineEditor'

export function Item() {
  const { id } = useParams<{ id: string }>()
  const { world } = useParams()
  const { database, useLiveQuery } = useFireproof(world)

  const [item, setItem] = useState<ActDoc | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)

  const scenes = useLiveQuery(
    (doc, emit) => {
      if (doc.type === 'scene' && doc.actId) {
        emit([doc.actId, doc.number])
      }
    },
    { descending: false }
  ).docs //as SceneDoc[]


  useEffect(() => {
    const fetchItem = async () => {
      const doc = (await database.get(id!)) as ActDoc
      // doc.topic = (await database.get(doc.storylineId as string)) as StorylineDoc
      if (doc.type === 'act') {
        setItem(doc)
      }
    }
    fetchItem()
  }, [id, database])

  if (!item) {
    return <div>Loading...</div>
  }

  console.log({ item, scenes })

  const storylineId = item.storylineId

  return (
    <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
      <Link to={`/${world}/storyline/${storylineId}`} className="text-white">
        ← back to {item.storyline?.title}
      </Link>
      <InlineEditor
        field="title"
        document={item}
        database={database}
        isEditing={isEditingName}
        setIsEditing={setIsEditingName}
      >
        <h2 className="text-4xl font-bold mb-2">{item.title}</h2>
      </InlineEditor>
      <InlineEditor
        field="description"
        document={item}
        database={database}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <p className="text-sm">Created: {new Date(item.created).toLocaleString()}</p>
      <p className="text-sm">Updated: {new Date(item.updated).toLocaleString()}</p>
      <ul>
        {scenes.map(scene => (
          <li key={scene._id} className=" p-2">
            <Link to={`/${world}/scene/${scene._id}`}>{scene.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
