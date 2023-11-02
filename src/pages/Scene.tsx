import { useParams } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { SceneDoc } from '../fireproof'
import { client } from '../prompts'

const apiKey = localStorage.getItem('api-key')

export function Scene() {
  const { id, world } = useParams()
  const { useDocument } = useFireproof(world)

  const [scene] = useDocument({ _id: id! }) as unknown as [SceneDoc]

  const generatePanels = async () => {
    if (!apiKey) throw new Error('No API key set')
    // todo load the breadcrumbs to pass
    await client(apiKey, database).generatePanelsFromScene(storyline)
  }

  return (
    <div className="">
      <p>{scene.title}</p>

      <button
        className={`font-bold my-4 py-2 px-4 rounded ${
          scene.title
            ? 'bg-blue-500 hover:bg-blue-700 text-white'
            : 'bg-gray-500 text-gray-300'
        }`}
        onClick={generatePanels}
        disabled={!scene.title}
      >
        Generate Panels
      </button>
    </div>
  )
}
