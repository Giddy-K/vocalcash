"use client";

import { useState } from "react";
import { ParsedTransaction, parseTransactionFromText } from "@/lib/whisper";
import { supabase } from "@/lib/supabase";

export default function TransactionForm() {
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedTransaction | null>(null);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const parsed = await parseTransactionFromText(transcript);

      const { error } = await supabase.from("transactions").insert([parsed]);
      if (error) throw error;

      alert("Transaction saved!");
      setTranscript("");
    } catch (err) {
      console.error(err);
      alert("Error saving transaction.");
    } finally {
      setLoading(false);
    }
  };

  const handleParse = async () => {
    setLoading(true);
    try {
      const result = await parseTransactionFromText(transcript);
      setParsed(result);
    } catch (err) {
      console.error("Parse error:", err);
      alert("Failed to parse.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!parsed) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("transactions").insert([parsed]);
      if (error) throw error;
      alert("Transaction saved!");
      setParsed(null);
      setTranscript("");
    } catch (err) {
      console.error(err);
      alert("Error saving transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button onClick={handleVoiceInput} disabled={recording} className="btn">
        {recording ? "🎙️ Listening..." : "🎤 Start Recording"}
      </button>

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        className="w-full border p-2 rounded"
        rows={3}
        placeholder="I earned 1500 from freelance work"
      />

      <button
        onClick={handleParse}
        disabled={loading}
        className="btn bg-indigo-600 text-white"
      >
        {loading ? "Parsing..." : "🔍 Parse Input"}
      </button>

      {parsed && (
        <div className="border p-3 rounded bg-gray-50">
          <p>
            <strong>Type:</strong> {parsed.type}
          </p>
          <p>
            <strong>Amount:</strong> {parsed.amount}
          </p>
          <p>
            <strong>Category:</strong> {parsed.category}
          </p>
          <p>
            <strong>Note:</strong> {parsed.note}
          </p>
          <button
            onClick={handleConfirm}
            className="btn mt-2 bg-green-600 text-white"
          >
            ✅ Confirm & Save
          </button>
        </div>
      )}
    </div>
  );
}
