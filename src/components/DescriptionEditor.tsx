import React, { useState } from 'react';
import type { Database } from 'use-fireproof';

type DescriptionEditorProps = {
  topic: { description?: string; updated: number } ;
  database: Database;
  isEditingDescription: boolean;
  setIsEditingDescription: (value: boolean) => void;
};

export const DescriptionEditor: React.FC<DescriptionEditorProps> = ({
  topic,
  database,
  isEditingDescription,
  setIsEditingDescription,
}) => {
  const [newDescription, setNewDescription] = useState('');

  return isEditingDescription || !topic?.description ? (
    <form
      onSubmit={e => {
        e.preventDefault();
        topic.description = newDescription;
        topic.updated = Date.now();
        database.put(topic);
        setIsEditingDescription(false);
        setNewDescription('');
      }}
    >
      <div className="w-full flex p-2">
        <label className="block text-sm font-bold mb-2 pr-2" htmlFor="description">
          Edit description:
        </label>
        <input
          id="description"
          className="border-2 border-gray-300 p-1 mr-2 text-sm text-black w-full rounded-md focus:outline-none focus:border-blue-500"
          type="text"
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
        />
        <button className="w-8 h-8" type="submit">
          ✔️
        </button>
      </div>
    </form>
  ) : (
    <div
      onClick={() => {
        setNewDescription(topic?.description?.toString() || '');
        setIsEditingDescription(true);
      }}
      className="prose prose-slate dark:prose-invert"
    >
      <p>{topic?.description}</p>
    </div>
  );
};