import { useState } from "react";

export default function SummaryForm() {
  const [mode, setMode] = useState("text");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    setLoading(true);
    setError("");
    setSummary("");
    setAnswer("");
    setChatHistory([]);

    try {
      const res = await fetch("/api/summarize-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    setSummary("");
    setAnswer("");
    setChatHistory([]);

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/summarize-file", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    setAnswer("Thinking...");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: summary, question }),
      });
      const data = await res.json();
      setAnswer(data.answer);

      setChatHistory((prev) => [...prev, { q: question, a: data.answer }]);
      setQuestion("");
    } catch (err) {
      console.error(err);
      setAnswer("Sorry, couldn't answer that.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      {/* Mode Toggle */}
      <div style={{ display: "flex", marginBottom: 16 }}>
        {["text", "file"].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setSummary("");
              setAnswer("");
              setError("");
              setChatHistory([]);
            }}
            style={{
              flex: 1,
              padding: "8px 0",
              cursor: "pointer",
              background: mode === m ? "#007bff" : "#f0f0f0",
              color: mode === m ? "white" : "black",
              border: "1px solid #ccc",
              borderBottom: mode === m ? "none" : "1px solid #ccc",
              borderRadius: m === "text" ? "4px 0 0 0" : "0 4px 0 0",
            }}
          >
            {m === "text" ? "Text" : "File"}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={mode === "text" ? handleTextSubmit : handleFileSubmit}>
        {mode === "text" && (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Paste clinical note here…"
            rows={8}
            style={{ width: "100%", padding: 8, fontFamily: "monospace" }}
            disabled={loading}
          />
        )}
        {mode === "file" && (
          <input
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={(e) => setFile(e.target.files && e.target.files[0])}
            disabled={loading}
            style={{ marginBottom: 12 }}
          />
        )}

        <button
          type="submit"
          disabled={loading || (mode === "text" ? !note.trim() : !file)}
          style={{
            width: "100%",
            padding: 12,
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading
            ? "Summarizing…"
            : mode === "text"
            ? "Summarize Text"
            : "Summarize File"}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <p style={{ color: "red", marginTop: 12 }}>{error}</p>
      )}

      {/* Summary and Q&A */}
      {summary && (
        <>
          {/* Summary Block */}
          <div
            style={{
              marginTop: 20,
              padding: 16,
              border: "1px solid #ccc",
              borderRadius: 4,
              background: "#fafafa",
              whiteSpace: "pre-wrap",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Summary</h3>
            {summary}
          </div>

          {/* Ask a Question */}
          <div style={{ marginTop: 20 }}>
            <input
              type="text"
              placeholder="Ask a question about the summary..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 8 }}
              disabled={loading}
            />
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              style={{
                width: "100%",
                padding: 10,
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: 4,
              }}
            >
              Ask Question
            </button>

            {answer && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  background: "#eef",
                  borderRadius: 4,
                }}
                dangerouslySetInnerHTML={{ __html: `<strong>Answer:</strong> ${answer}` }}
              />
            )}
          </div>

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h4>🧠 Q&A History</h4>
              <div style={{ padding: 12, background: "#f9f9f9", borderRadius: 4 }}>
                {chatHistory.map((entry, idx) => (
                  <div key={idx} style={{ marginBottom: 12 }}>
                    <p style={{ margin: 0 }}>
                      <strong>❓ You:</strong> {entry.q}
                    </p>
                    <div
                      style={{ margin: "4px 0 0" }}
                      dangerouslySetInnerHTML={{
                        __html: `<strong>💬 AI:</strong> ${entry.a}`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
