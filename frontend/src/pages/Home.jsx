import { useEffect, useState } from "react";
import TopBar from "../components/TopBar.jsx";
import TrackCard from "../components/TrackCard.jsx";
import Footer from "../components/Footer.jsx";
import { api } from "../api.js";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getTracks().then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <TopBar learner={data?.learner} />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-offwhite leading-tight">
          Learn to code, one syntax rule at a time.
        </h1>
        <p className="mt-3 max-w-xl font-body text-base text-muted leading-relaxed">
          Pick a language. Short lessons, instant feedback, no setup required
          on your end — just tap and go.
        </p>

        {error && (
          <p className="mt-6 rounded-lg border border-danger/40 bg-danger/10 p-3 font-mono text-sm text-danger">
            Couldn't reach the API at localhost:4000 — is the backend running?
            <br />
            ({error})
          </p>
        )}

        {data && (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
