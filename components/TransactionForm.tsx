'use client'

import { useState } from 'react'
import { ParsedTransaction, parseTransactionFromText } from '@/lib/whisper'
import { supabase } from '@/lib/supabase'

export default function TransactionForm() {
  const [transcript, setTranscript] = useState('')
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [parsed, setParsed] = useState<ParsedTransaction | null>(null)

  /* -------------------------- Voice Recording -------------------------- */
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setRecording(true)
    recognition.onend   = () => setRecording(false)

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setTranscript(text)
    }

    recognition.start()
  }

  /* ----------------------------- Parse Step ---------------------------- */
  const handleParse = async () => {
    setLoading(true)
    try {
      const result = await parseTransactionFromText(transcript)
      setParsed(result)
    } catch (err) {
      console.error('Parse error:', err)
      alert('Failed to parse.')
    } finally {
      setLoading(false)
    }
  }

  /* ------------------------ Confirm & Save Step ------------------------ */
  const handleConfirm = async () => {
    if (!parsed) return
    setLoading(true)

    /* 1️⃣ Check auth */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      alert('You must be logged in to submit a transaction.')
      setLoading(false)
      return
    }

    /* 2️⃣ Insert with user_id */
    const { error } = await supabase.from('transactions').insert([
      {
        ...parsed,
        user_id: user.id,
      },
    ])

    if (error) {
      console.error('Insert error:', error)
      alert('Failed to add transaction.')
    } else {
      alert('Transaction added!')
      setParsed(null)
      setTranscript('')
    }

    setLoading(false)
  }

  /* -------------------------------------------------------------------- */
  return (
    <div className="space-y-2">
      {/* Record button */}
      <button onClick={handleVoiceInput} disabled={recording} className="btn">
        {recording ? '🎙️ Listening…' : '🎤 Start Recording'}
      </button>

      {/* Manual text input */}
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        className="w-full border p-2 rounded"
        rows={3}
        placeholder="I earned 1500 from freelance work"
      />

      {/* Parse button */}
      <button
        onClick={handleParse}
        disabled={loading}
        className="btn bg-indigo-600 text-white"
      >
        {loading ? 'Parsing…' : '🔍 Parse Input'}
      </button>

      {/* Parsed preview & confirm */}
      {parsed && (
        <div className="border p-3 rounded bg-gray-50">
          <p><strong>Type:</strong> {parsed.type}</p>
          <p><strong>Amount:</strong> {parsed.amount}</p>
          <p><strong>Category:</strong> {parsed.category}</p>
          <p><strong>Note:</strong> {parsed.note}</p>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="btn mt-2 bg-green-600 text-white"
          >
            {loading ? 'Saving…' : '✅ Confirm & Save'}
          </button>
        </div>
      )}
    </div>
  )
}
