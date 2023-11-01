export type ActDoc = {
  _id?: string
  storylineId: string
  number: number
  title: string
  scenes: string[]
  type: 'act'
}


export function actsForStoryline(doc, emit) {
  if (doc.type === 'act' && doc.storylineId) {
    console.log('actsForStoryline', doc, [doc.storylineId, doc.number])
    emit([doc.storylineId, doc.number])
  }
}