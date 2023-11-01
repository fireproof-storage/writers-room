export type ActDoc = {
  _id?: string
  storylineId: string
  number: number
  title: string
  scenes: string[]
  type: 'act'
}

export const actsForStoryline = (doc: ActDoc, emit: (key: unknown[]) => void) => {
  if (doc.type === 'act' && doc.storylineId) {
    console.log('actsForStoryline', doc, [doc.storylineId, doc.number])
    emit([doc.storylineId, doc.number])
  }
}

