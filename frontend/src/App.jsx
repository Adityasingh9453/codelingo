import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import TrackMap from "./pages/TrackMap.jsx";
import LessonPlayer from "./pages/LessonPlayer.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/track/:trackId" element={<TrackMap />} />
      <Route path="/lesson/:lessonId" element={<LessonPlayer />} />
    </Routes>
  );
}
