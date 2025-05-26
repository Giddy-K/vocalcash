'use client'

import { useState, useEffect } from 'react'
import { ParsedTransaction, parseTransactionFromText } from '@/lib/whisper'
import { supabase } from '@/lib/supabase'

// Simple spinner SVG component
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white inline-block"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  )
}

export default function TransactionForm() {
  const [transcript, setTranscript] = useState('')
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [parsed, setParsed] = useState<ParsedTransaction | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Persist parsed transaction in localStorage so it's not lost on reload
  useEffect(() => {
    if (parsed) {
      localStorage.setItem('parsedTransaction', JSON.stringify(parsed))
    } else {
      localStorage.removeItem('parsedTransaction')
    }
  }, [parsed])

  useEffect(() => {
    const savedParsed = localStorage.getItem('parsedTransaction')
    if (savedParsed) {
      setParsed(JSON.parse(savedParsed))
    }
  }, [])

  /* -------------------------- Voice Recording -------------------------- */
  const handleVoiceInput = () => {
    setErrorMsg('')
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setErrorMsg('Speech recognition is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setRecording(true)
    recognition.onend = () => setRecording(false)

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setTranscript(text)
    }

    recognition.onerror = (e: any) => {
      setErrorMsg('Error with speech recognition. Please try again.')
      setRecording(false)
    }

    recognition.start()
  }

  /* ----------------------------- Parse Step ---------------------------- */
  const handleParse = async () => {
    setErrorMsg('')
    if (!transcript.trim()) {
      setErrorMsg('Please enter or record a transaction description first.')
      return
    }
    setLoading(true)
    try {
      const result = await parseTransactionFromText(transcript)
      setParsed(result)
    } catch (err) {
      console.error('Parse error:', err)
      setErrorMsg('Failed to parse the input. Please try a different phrasing.')
    } finally {
      setLoading(false)
    }
  }

  /* ------------------------ Confirm & Save Step ------------------------ */
  const handleConfirm = async () => {
    if (!parsed) return
    setLoading(true)
    setErrorMsg('')

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setErrorMsg('You must be logged in to submit a transaction.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('transactions').insert([
      {
        ...parsed,
        user_id: user.id,
      },
    ])

    if (error) {
      console.error('Insert error:', error)
      setErrorMsg('Failed to add transaction. Please try again.')
    } else {
      alert('Transaction added!')
      setParsed(null)
      setTranscript('')
    }

    setLoading(false)
  }

  /* ------------------------ Clear Transcript --------------------------- */
  const handleClear = () => {
    setTranscript('')
    setParsed(null)
    setErrorMsg('')
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Error message */}
      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-2 rounded border border-red-300">
          {errorMsg}
        </div>
      )}

      {/* Record button */}
      <button
        onClick={handleVoiceInput}
        disabled={recording || loading}
        className={`w-full py-3 rounded-md font-semibold shadow
          ${recording || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
          text-white transition flex items-center justify-center gap-2`}
        aria-live="polite"
        aria-disabled={recording || loading}
        aria-label={recording ? 'Listening' : 'Start recording transaction description'}
      >
        {recording ? (
          <>
            <span className="animate-pulse text-2xl" aria-hidden="true">🎙️</span> Listening…
          </>
        ) : (
          <>
            <span>🎤</span> Start Recording
          </>
        )}
      </button>

      {/* Manual text input */}
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        rows={4}
        placeholder="I earned 1500 from freelance work"
        disabled={loading}
        aria-label="Transaction description"
      />

      {/* Clear button */}
      <button
        onClick={handleClear}
        disabled={loading && !transcript}
        className={`w-full py-2 rounded-md font-semibold shadow
          ${!transcript ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}
          text-white transition`}
        aria-label="Clear transaction input"
      >
        Clear Input
      </button>

      {/* Parse button */}
      <button
        onClick={handleParse}
        disabled={loading || !transcript.trim()}
        className={`w-full py-3 rounded-md font-semibold shadow
          ${loading || !transcript.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
          text-white transition flex items-center justify-center gap-2`}
        aria-live="polite"
        aria-disabled={loading || !transcript.trim()}
      >
        {loading ? <Spinner /> : '🔍 Parse Input'}
      </button>

      {/* Parsed preview & confirm */}
      {parsed && (
        <div className="border border-gray-300 p-4 rounded-md bg-gray-50 shadow-sm">
          <p>
            <strong>Type:</strong> {parsed.type}
          </p>
          <p>
            <strong>Amount:</strong>{' '}
            {parsed.amount.toLocaleString(undefined, {
              style: 'currency',
              currency: 'KES',
            })}
          </p>
          <p>
            <strong>Category:</strong> {parsed.category}
          </p>
          <p>
            <strong>Note:</strong> {parsed.note || '—'}
          </p>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`mt-4 w-full py-3 rounded-md font-semibold shadow
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
              text-white transition flex items-center justify-center gap-2`}
            aria-live="polite"
            aria-disabled={loading}
          >
            {loading ? <Spinner /> : '✅ Confirm & Save'}
          </button>
        </div>
      )}
    </div>
  )
}
