import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import WeekPracticePage from './pages/WeekPracticePage';
import FullTestPage from './pages/FullTestPage';
import ReviewPage from './pages/ReviewPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';

function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary inline-flex">Go Home</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/week/:weekNumber" element={<WeekPracticePage />} />
            <Route path="/full-test" element={<FullTestPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="border-t border-gray-100 dark:border-gray-800 py-4 px-4 text-center text-xs text-gray-400 dark:text-gray-600">
          MCQ Practice Hub · Research Methodology · NPTEL / SWAYAM · 120 Questions
        </footer>
      </div>
    </BrowserRouter>
  );
}
