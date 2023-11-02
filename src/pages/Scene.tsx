import { useParams } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { SceneDoc } from '../fireproof'

export function Scene() {
  const { id, world } = useParams()
  const { useDocument } = useFireproof(world)

  const [scene] = useDocument({ _id: id! }) as unknown as [SceneDoc]
  return <div className="">{scene.title}</div>
}
