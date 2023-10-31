import { useState } from 'react'
import {
  useParams
  // , useNavigate
} from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { Acts } from '../components/Acts'
import { InlineEditor } from '../components/InlineEditor'
import { client } from '../prompts'

const apiKey = localStorage.getItem('api-key')

export type StorylineDoc = {
  _id?: string
  title: string
  description?: string
  created: number
  updated: number
  type: 'storyline'
}

export function Storyline() {
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  const { database, useLiveQuery } = useFireproof('topics')
  const { id } = useParams()

  const storylines = useLiveQuery('_id', { key: id })
  const [storyline] = storylines.docs as StorylineDoc[]

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
          Created: {new Date(storyline?.created).toLocaleString()}
        </span>
        <span className="ml-4 text-sm text-gray-500">
          Updated: {new Date(storyline?.updated).toLocaleString()}
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
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={generateActs}
      >
        Generate Acts
      </button>

      <Acts storylineId={id!} />
    </div>
  )
}
