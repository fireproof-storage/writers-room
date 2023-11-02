import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { Acts } from '../components/Acts'
import { InlineEditor } from '../components/InlineEditor'
import { client } from '../prompts'
import { StorylineDoc } from '../fireproof'

const apiKey = localStorage.getItem('api-key')

export function Storyline() {
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const { world } = useParams()
  const { database, useDocument } = useFireproof(world)
  const { id } = useParams()

  const [storyline] = useDocument({ _id: id! }) as unknown as [StorylineDoc]
  // const [storyline] = useDocument<StorylineDoc>({ _id: id! }) as unknown as [StorylineDoc]

  console.log('storyline', storyline)

  const generateActs = async () => {
    if (!apiKey) throw new Error('No API key set')
    await client(apiKey, database).generateActsFromStoryline(storyline)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        {isEditingTitle ? (
          <InlineEditor
            field="title"
            document={storyline}
            database={database}
            isEditing={isEditingTitle}
            setIsEditing={setIsEditingTitle}
          />
        ) : (
          <h1 className="text-2xl font-bold" onClick={() => setIsEditingTitle(true)}>
            {storyline?.title}
          </h1>
        )}
      </div>
      <div className="mb-2">
        <span className="text-sm text-gray-500">
          Created: {new Date(storyline.created).toLocaleString()}
        </span>
        <span className="ml-4 text-sm text-gray-500">
          Updated: {new Date(storyline.updated).toLocaleString()}
        </span>
      </div>
      <InlineEditor
        field="description"
        label="Edit Description: "
        document={storyline}
        database={database}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <button
        className={`font-bold py-2 px-4 rounded ${storyline?.description ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-500 text-gray-300'}`}
        onClick={generateActs}
        disabled={!storyline?.description}
      >
        Generate Acts
      </button>

      <Acts storylineId={id!} />
    </div>
  )
}
