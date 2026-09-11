import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Home        from "./pages/Home.jsx";
import TrackMap    from "./pages/TrackMap.jsx";
import LessonPlayer from "./pages/LessonPlayer.jsx";
import Dashboard   from "./pages/Dashboard.jsx";
import Login       from "./pages/Login.jsx";
import Register    from "./pages/Register.jsx";

// Redirects unauthenticated users to /login
function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/login" replace />;
}

// Redirects already-logged-in users away from /login and /register
function GuestRoute({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Guest-only routes */}
      <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      {/* Protected routes */}
      <Route path="/"                    element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/dashboard"           element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/track/:trackId"      element={<ProtectedRoute><TrackMap /></ProtectedRoute>} />
      <Route path="/lesson/:lessonId"    element={<ProtectedRoute><LessonPlayer /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
