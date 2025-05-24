export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">🎙️ VocalCash</h1>
      <p className="text-lg mt-2 text-gray-600">
        Track your income & expenses using your voice.
      </p>

      <div className="mt-6 space-y-4">
        <a href="/transactions/new" className="block bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition">
          ➕ Add New Transaction
        </a>
        <a href="/dashboard" className="block bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition">
          📊 View Summary
        </a>
      </div>
    </main>
  )
}
