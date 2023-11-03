import { CallbackFn, MapFn } from '@fireproof/core'

type StoryDoc = {
  _id?: string
  updated: number
  created: number
}

export type StorylineDoc = StoryDoc & {
  _id?: string
  title: string
  description?: string
  type: 'storyline'
}

export type ActDoc = StoryDoc & {
  storylineId: string
  number: number
  title: string
  type: 'act'
}

export const actsForStoryline = (doc: ActDoc, emit: CallbackFn) => {
  if (doc.type === 'act' && doc.storylineId) {
    // emit([doc.storylineId, doc.number])
    emit(doc.storylineId)
  }
}

export type SceneDoc = StoryDoc & {
  title: string
  actId: string
  type: 'scene'
  position: number
}

export const scenesForAct = (doc: SceneDoc, emit: CallbackFn) => {
  if (doc.type === 'scene' && doc.actId) {
    // emit([doc.actId, doc.position])
    emit(doc.actId!)
  }
}

export type PanelDoc = StoryDoc & {
  type: 'panel'
  position: number
  sceneId: string
  narrative: string
  visual: string
  caption: string
  imageUrls: string[]
}

const pfs = (doc: PanelDoc, emit: CallbackFn) => {
  if (doc.type === 'panel' && doc.sceneId) {
    // emit([doc.sceneId, doc.position])
    emit(doc.sceneId!)
  }
}

export const panelsForScene = pfs as unknown as MapFn
