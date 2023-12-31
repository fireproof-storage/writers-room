import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { InlineEditor } from '../components/InlineEditor'
import { client } from '../prompts'

const apiKey = localStorage.getItem('api-key')

export type CharacterDoc = {
  _id?: string
  name: string
  backgroundStory?: string
  visualDescription?: string
  plotlineRole?: string
  created: number
  updated: number
  type: 'character'
  imagePrompt?: string
  profileImgURLs?: string[]
  faceImgURLs?: string[]
}

export function Character() {
  // const navigate = useNavigate() // Initialize useHistory hook
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)

  const { world } = useParams()
  const { database, useLiveQuery } = useFireproof(world)

  const { id } = useParams()

  const characters = useLiveQuery('_id', { key: id }).docs as CharacterDoc[]
  const [character] = characters

  const generateImagePrompt = async () => {
    if (!apiKey) throw new Error('No API key set')
    const imagePrompt = await client(apiKey, database).detailedCharacterVisualDescription(character)
    await database.put({ ...character, imagePrompt })
  }

  const generateImages = async () => {
    if (!apiKey) throw new Error('No API key set')
    const imageUrls = (await client(apiKey, database).generateProfileImage(character)) as string[]
    console.log(imageUrls)
    const faceImgs = (await client(apiKey, database).generateFaceImages(character)) as string[]
    await database.put({ ...character, profileImgURLs: imageUrls, faceImgURLs: faceImgs })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        {isEditingName ? (
          <InlineEditor
            field="title"
            document={character}
            database={database}
            isEditing={isEditingName}
            setIsEditing={setIsEditingName}
          />
        ) : (
          <h1 className="text-2xl font-bold" onClick={() => setIsEditingName(true)}>
            {character?.name}
          </h1>
        )}
      </div>
      <div className="mb-2">
        <span className="text-sm text-gray-500">
          Created: {new Date(character?.created).toLocaleString()}
        </span>
        <span className="ml-4 text-sm text-gray-500">
          Updated: {new Date(character?.updated).toLocaleString()}
        </span>
      </div>
      <InlineEditor
        field="backgroundStory"
        label="background story"
        document={character}
        database={database}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <InlineEditor
        field="visualDescription"
        label="visual description"
        document={character}
        database={database}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <InlineEditor
        field="plotlineRole"
        label="plotline role"
        document={character}
        database={database}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <h2 className="text-2xl text-bold">Generate Images</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 m-2 px-4 rounded"
        onClick={generateImagePrompt}
      >
        Generate Image Prompt
      </button>
      <p>{character?.imagePrompt}</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 m-2 px-4 rounded"
        onClick={generateImages}
      >
        Generate Images
      </button>
      {character?.profileImgURLs?.map(url => (
        <img src={url} alt="profile" />
      ))}
            {character?.faceImgURLs?.map(url => (
        <img src={url} alt="profile" />
      ))}
    </div>
  )
}
