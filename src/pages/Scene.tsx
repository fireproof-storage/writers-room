import { useParams } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { ActDoc, PanelDoc, SceneDoc, StorylineDoc, panelsForScene } from '../fireproof'
import { client } from '../prompts'
import { useEffect, useState } from 'react'

const apiKey = localStorage.getItem('api-key')

export function Scene() {
  const { id, world } = useParams()
  const { database, useDocument, useLiveQuery } = useFireproof(world)

  const [scene] = useDocument({ _id: id! }) as unknown as [SceneDoc]

  const panels = useLiveQuery(panelsForScene, { key: id }).docs as PanelDoc[]

  const [act, setAct] = useState<ActDoc>()
  const [storyline, setStoryline] = useState<StorylineDoc>()

  useEffect(() => {
    if (!scene || !scene.actId) return
    const getAct = async () => {
      const act = (await database.get(scene.actId!)) as ActDoc
      setAct(act)
    }
    getAct()
  }, [database, scene])

  useEffect(() => {
    if (!act) return
    const getStoryline = async () => {
      const storyline = (await database.get(act.storylineId!)) as StorylineDoc
      setStoryline(storyline)
    }
    getStoryline()
  }, [database, act])

  const generatePanels = async () => {
    if (!apiKey) throw new Error('No API key set')
    if (!storyline) throw new Error('No storyline set')
    if (!act) throw new Error('No act set')
    console.log('scene', storyline, act, scene)
    await client(apiKey, database).generatePanelsFromScene(storyline, act, scene)
  }
  const generatePanelImages = async () => {
    if (!apiKey) throw new Error('No API key set')
    if (!storyline) throw new Error('No storyline set')
    if (!act) throw new Error('No act set')
    if (!panels.length) throw new Error('No panels to generate')
    await client(apiKey, database).generatePanelImages(storyline, act, scene, panels)
  }

  return (
    <div className="">
      <p>{scene.title}</p>

      <button
        className={`font-bold my-4 py-2 px-4 rounded ${
          scene.title ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-500 text-gray-300'
        }`}
        onClick={generatePanels}
        disabled={!scene.title}
      >
        Generate Panels
      </button>

      {panels.length > 0 && <PanelList panels={panels} generate={generatePanelImages} />}
    </div>
  )
}

const PanelList = ({ generate, panels }: { panels: PanelDoc[]; generate: () => void }) => (
  <>
    <h2 className="text-2xl font-bold mb-2">{panels.length} Panels</h2>

    <button
      className={`font-bold my-4 py-2 px-4 rounded bg-blue-500 hover:bg-blue-700 text-white`}
      onClick={generate}
    >
      Generate Panel Images
    </button>

    <ul>
      {panels.map(panel => (
        <li key={panel._id} className=" p-2">
          <p>
            <strong className="font-bold">Narrative:</strong> {panel.narrative}
          </p>
          <p>
            <strong className="font-bold">Visual:</strong> {panel.visual}
          </p>
          <p>
            <strong className="font-bold">Caption:</strong> {panel.caption}
          </p>
          <div className="grid grid-cols-4 gap-4">
            {panel.imageUrls?.map(url => (
              <div key={url}>
                <img src={url} alt={panel.narrative} />
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  </>
)
