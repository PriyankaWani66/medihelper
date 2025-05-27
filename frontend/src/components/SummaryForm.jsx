import { useState } from "react";
import VoiceRecorder from "./VoiceRecorder";
import { extractFollowUps } from "../utils/extractFollowUps";
import { generateCalendarLink } from "../utils/generateCalendarLink";

export default function SummaryForm() {
  const [mode, setMode] = useState("text");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [lang, setLang] = useState("English");
  const [reminders, setReminders] = useState([]);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    setLoading(true);
    setError("");
    setSummary("");
    setChatHistory([]);

    try {
      const res = await fetch("/api/summarize-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, lang }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSummary(data.summary);
      setReminders(extractFollowUps(data.summary));
    } catch (err) {
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
    setChatHistory([]);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("lang", lang);
      const res = await fetch("/api/summarize-file", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSummary(data.summary);
      setReminders(extractFollowUps(data.summary));
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    const newChat = { q: question, a: "Thinking..." };
    setChatHistory((prev) => [...prev, newChat]);
    setQuestion("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: summary, question }),
      });
      const data = await res.json();

      setChatHistory((prev) =>
        prev.map((chat, i) =>
          i === prev.length - 1 ? { ...chat, a: data.answer } : chat
        )
      );
    } catch (err) {
      setChatHistory((prev) =>
        prev.map((chat, i) =>
          i === prev.length - 1
            ? { ...chat, a: "Sorry, couldn't answer that." }
            : chat
        )
      );
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", marginBottom: 16 }}>
        {["text", "file"].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setSummary("");
              setError("");
              setChatHistory([]);
              setReminders([]);
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

      <form onSubmit={mode === "text" ? handleTextSubmit : handleFileSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="lang-select">Summary Language:</label>
          <select
            id="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>

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
            onChange={(e) => setFile(e.target.files?.[0])}
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

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

      {summary && (
        <>
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

          {reminders.length > 0 && (
            <div
              style={{
                marginTop: 16,
                padding: 16,
                background: "#fff3cd",
                border: "1px solid #ffeeba",
                borderRadius: 4,
              }}
            >
              <h4>📅 Follow-up Reminders</h4>
              <ul>
                {reminders.map((r, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>
                    {r}
                    <a
                      href={generateCalendarLink(r)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: 12,
                        fontSize: 12,
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: 4,
                        textDecoration: "none",
                      }}
                    >
                      📅 Add to Google Calendar
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <input
              type="text"
              placeholder="Ask a question about the summary..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 8 }}
              disabled={loading}
            />
            <VoiceRecorder onTranscript={(text) => setQuestion(text)} />
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
                marginTop: 10,
              }}
            >
              Ask Question
            </button>
          </div>

          {chatHistory.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h4>🧠 Q&A Chat</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {chatHistory.map((entry, idx) => (
                  <div key={idx} style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        alignSelf: "flex-end",
                        background: "#d4edda",
                        color: "#155724",
                        padding: 10,
                        borderRadius: 10,
                        maxWidth: "90%",
                      }}
                    >
                      {entry.q}
                    </div>
                    <div
                      style={{
                        alignSelf: "flex-start",
                        background: "#f1f1f1",
                        padding: 10,
                        borderRadius: 10,
                        maxWidth: "90%",
                      }}
                      dangerouslySetInnerHTML={{ __html: entry.a }}
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
