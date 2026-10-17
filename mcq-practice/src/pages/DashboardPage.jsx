import { useNavigate } from 'react-router-dom';
import { BarChart2, Star, TrendingUp, Clock, BookOpen, Trash2, Play, Award, Target } from 'lucide-react';
import { getAllWeeks, getScoreBg, getScoreColor, formatDate } from '../utils/dataUtils';
import useStore from '../store/useStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { weekProgress, fullTestHistory, clearAllProgress } = useStore();
  const weeks = getAllWeeks();

  const totalAttempts = Object.values(weekProgress).reduce((s, w) => s + (w.attempts || 0), 0);
  const weeksAttempted = Object.keys(weekProgress).length;
  const totalCorrect = Object.values(weekProgress).reduce((s, w) =>
    s + Object.values(w.correctMap || {}).filter(Boolean).length, 0);
  const avgBest = weeksAttempted > 0
    ? Math.round(Object.values(weekProgress).reduce((s, w) => s + (w.bestScore || 0), 0) / weeksAttempted)
    : 0;

  const fullTestBest = fullTestHistory.length > 0
    ? Math.max(...fullTestHistory.map((h) => h.percentage))
    : 0;

  const handleClearProgress = () => {
    if (window.confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      clearAllProgress();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-8 h-8 text-indigo-600" />
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your progress across all weeks</p>
        </div>
        {totalAttempts > 0 && (
          <button
            onClick={handleClearProgress}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 px-3 py-2 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear Progress
          </button>
        )}
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Weeks Attempted', value: `${weeksAttempted}/12`, icon: BookOpen, color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-950' },
          { label: 'Total Attempts', value: totalAttempts, icon: TrendingUp, color: 'bg-purple-500', bg: 'bg-purple-50 dark:bg-purple-950' },
          { label: 'Avg Best Score', value: weeksAttempted > 0 ? `${avgBest}%` : '—', icon: Star, color: 'bg-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950' },
          { label: 'Full Test Best', value: fullTestHistory.length > 0 ? `${fullTestBest}%` : '—', icon: Award, color: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-950' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Week Progress Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Week-by-Week Progress
        </h2>

        {totalAttempts === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No quizzes attempted yet. Start practicing!</p>
            <button onClick={() => navigate('/')} className="btn-primary inline-flex items-center gap-2">
              <Play className="w-4 h-4" />Start Practicing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeks.map(({ week, topic }) => {
              const prog = weekProgress[week];
              if (!prog) {
                return (
                  <div key={week} className="card p-4 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">WEEK {week}</span>
                      <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-400">Not attempted</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">{topic}</p>
                    <button
                      onClick={() => navigate(`/week/${week}`)}
                      className="w-full py-2 text-sm btn-outline"
                    >
                      Start
                    </button>
                  </div>
                );
              }
              return (
                <div key={week} className="card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">WEEK {week}</span>
                    <span className={`badge ${getScoreBg(prog.bestScore)}`}>
                      <Star className="w-3 h-3" />Best: {prog.bestScore}%
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 line-clamp-1">{topic}</p>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Best Score</span>
                      <span className={getScoreColor(prog.bestScore)}>{prog.bestScore}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${prog.bestScore}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{prog.attempts} attempt{prog.attempts > 1 ? 's' : ''}</span>
                    <span>Last: {prog.lastScore}%</span>
                  </div>

                  <button
                    onClick={() => navigate(`/week/${week}`)}
                    className="w-full py-2 text-sm btn-primary"
                  >
                    Practice Again
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Test History */}
      {fullTestHistory.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Full Test History
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-center">Questions</th>
                  <th className="px-4 py-3 text-center">Score</th>
                  <th className="px-4 py-3 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[...fullTestHistory].reverse().map((h, i) => (
                  <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 dark:text-gray-500">{fullTestHistory.length - i}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDate(h.date)}</td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{h.totalQuestions}</td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{h.score}/{h.totalQuestions}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`badge ${getScoreBg(h.percentage)}`}>{h.percentage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
