import React, { useState } from 'react'
import type { Database, DocFragment } from 'use-fireproof'

type InlineEditorProps = {
  document: { [key: string]: DocFragment; updated: number }
  database: Database
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  field: string
  label?: string
  children?: React.ReactNode
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  document,
  database,
  isEditing,
  setIsEditing,
  field,
  label,
  children
}) => {
  const [newValue, setNewValue] = useState(document?.[field]?.toString() || '')

  return isEditing || !document?.[field] ? (
    <form
      onSubmit={e => {
        e.preventDefault()
        document[field] = newValue
        document.updated = Date.now()
        database.put(document)
        setIsEditing(false)
        setNewValue('')
      }}
    >
      <div className="w-full flex p-2">
        {label && (
          <label className="block text-sm font-bold mb-2 pr-2" htmlFor={field}>
            {label}
          </label>
        )}
        <input
          id={field}
          className="border-2 border-gray-300 p-1 mr-2 text-sm text-black w-full rounded-md focus:outline-none focus:border-blue-500"
          type="text"
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
        />
        <button className="w-8 h-8" type="submit">
          ✔️
        </button>
        <button className="w-8 h-8" type="reset" onClick={() => setIsEditing(false)}>
          ✖️
        </button>
      </div>
    </form>
  ) : (
    <div
      onClick={() => {
        setNewValue(document?.[field]?.toString() || '')
        setIsEditing(true)
      }}
    >
      {children ? (
        children
      ) : (
        <>
          <span className="font-bold">{label}</span>
          <p className="prose prose-slate dark:prose-invert">{document?.[field]?.toString()}</p>
        </>
      )}
    </div>
  )
}
