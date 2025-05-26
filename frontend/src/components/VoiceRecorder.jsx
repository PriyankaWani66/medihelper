import { useState, useRef } from "react";

export default function VoiceRecorder({ onTranscript }) {
  const [recording, setRecording] = useState(false);
  const [language, setLanguage] = useState("en");
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob);

      try {
        const res = await fetch(`/api/transcribe-audio?language=${language}`, {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        if (data.transcript) onTranscript(data.transcript);
        else console.error("No transcript returned", data);
      } catch (err) {
        console.error("Transcription error:", err);
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div style={{ marginTop: 10 }}>
      <label htmlFor="lang-select">Language:</label>
      <select
        id="lang-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ marginLeft: 8, marginBottom: 10 }}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="hi">Hindi</option>
        <option value="pt">Portuguese</option>
        <option value="it">Italian</option>
        <option value="zh">Chinese</option>
        {/* Add more supported languages here */}
      </select>

      <br />
      <button
        onClick={recording ? stopRecording : startRecording}
        style={{
          padding: 10,
          background: recording ? "#dc3545" : "#17a2b8",
          color: "white",
          border: "none",
          borderRadius: 4,
          width: "100%"
        }}
      >
        {recording ? "Stop Recording" : "🎤 Record Question"}
      </button>
    </div>
  );
}
