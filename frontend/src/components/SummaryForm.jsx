// frontend/src/components/SummaryForm.jsx
import { useState } from "react"

export default function SummaryForm() {
  const [note, setNote] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!note.trim()) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/summarize-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setSummary(data.summary)
    } catch (e) {
      console.error(e)
      setError("Failed to summarize: " + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "2rem auto" }}>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Paste clinical note here…"
        rows={8}
        style={{ width: "100%", fontFamily: "monospace" }}
      />
      <button type="submit" disabled={loading || !note.trim()}>
        {loading ? "Summarizing…" : "Summarize"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {summary && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc" }}>
          <h3>Summary</h3>
          <pre>{summary}</pre>
        </div>
      )}
    </form>
  )
}
