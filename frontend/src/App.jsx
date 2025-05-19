import SummaryForm from "./components/SummaryForm";
import "./App.css";   // or wherever your global CSS lives

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-2xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
          <span className="mr-2">🩺</span> HealthSnap
        </h1>
        <p className="mt-2 text-gray-600">
          Paste your clinical note or upload a file to get a patient-friendly summary.
        </p>
      </header>

      <main className="max-w-2xl mx-auto">
        <SummaryForm />
      </main>
    </div>
  );
}