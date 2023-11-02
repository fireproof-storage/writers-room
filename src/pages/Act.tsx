import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapFn, useFireproof } from 'use-fireproof'
import { ActDoc, SceneDoc, scenesForAct } from '../fireproof'
// import { StorylineDoc } from './Storyline'
import { InlineEditor } from '../components/InlineEditor'

export function Act() {
  const { id } = useParams<{ id: string }>()
  const { world } = useParams()
  const { database, useLiveQuery, useDocument } = useFireproof(world)

  const [isEditing, setIsEditing] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)

  const scenes = useLiveQuery(scenesForAct as MapFn, { key: id }).docs as SceneDoc[]

  // const scenes = useLiveQuery(scenesForAct, { prefix: [id], descending: false }).docs //as SceneDoc[]

  const [item] = useDocument({ _id: id! }) as unknown as [ActDoc]
  const [storyline] = useDocument({ _id: item.storylineId! }) as unknown as [ActDoc]

  if (!item) {
    return <div>Loading...</div>
  }

  const storylineId = item.storylineId

  return (
    <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
      <Link to={`/${world}/storyline/${storylineId}`} className="text-white">
        ← back to {storyline.title}
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
