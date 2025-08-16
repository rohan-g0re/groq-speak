import React, { useState } from 'react'
import { captionsApi } from '../services/api'

export function CaptionGenerator() {
  const [prompt, setPrompt] = useState('')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const result = await captionsApi.generateCaption(prompt)
      setCaption(result.caption)
    } catch (err) {
      console.error('Error generating caption:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to generate caption. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Instagram Caption Generator</h1>
          <p className="text-gray-600">Create engaging Instagram captions with AI</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your post or photo
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A beautiful sunset at the beach, my new coffee setup, etc."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Caption'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {caption && !error && (
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-md">
              <h3 className="font-semibold text-purple-800 mb-2">Generated Caption:</h3>
              <p className="text-purple-700">{caption}</p>
              <button
                onClick={() => navigator.clipboard.writeText(caption)}
                className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
