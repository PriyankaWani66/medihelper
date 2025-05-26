import { useState, useRef } from "react";

export default function VoiceRecorder({ onTranscript }) {
  const [recording, setRecording] = useState(false);
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
        const res = await fetch("/api/transcribe-voice", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        onTranscript(data.transcript);
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
      <button onClick={recording ? stopRecording : startRecording}
              style={{
                padding: 10,
                background: recording ? "#dc3545" : "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: 4
              }}>
        {recording ? "Stop Recording" : "🎤 Record Question"}
      </button>
    </div>
  );
}
