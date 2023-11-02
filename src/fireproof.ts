import { CallbackFn } from '@fireproof/core'

type StoryDoc = {
  _id? : string
  updated: number
  created: number
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

export type StorylineDoc = StoryDoc & {
  _id?: string
  title: string
  description?: string
  type: 'storyline'
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
