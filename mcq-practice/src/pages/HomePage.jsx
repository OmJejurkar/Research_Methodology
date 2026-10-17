import { Link } from 'react-router-dom';
import { BookOpen, Play, Zap, BarChart2, Star, CheckCircle, Clock } from 'lucide-react';
import { getAllWeeks, getCourseInfo, getScoreBg } from '../utils/dataUtils';
import useStore from '../store/useStore';

export default function HomePage() {
  const { weekProgress } = useStore();
  const weeks = getAllWeeks();
  const courseInfo = getCourseInfo();

  const totalAttempts = Object.values(weekProgress).reduce((s, w) => s + (w.attempts || 0), 0);
  const avgScore = totalAttempts > 0
    ? Math.round(Object.values(weekProgress).reduce((s, w) => s + (w.lastScore || 0), 0) / Object.keys(weekProgress).length)
    : 0;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              {courseInfo.institution}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
              MCQ Practice Hub
            </h1>
            <p className="text-xl text-white/80 mb-3">{courseInfo.course}</p>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Master all {courseInfo.totalQuestions} questions across {courseInfo.totalWeeks} weeks with interactive practice, instant feedback, and detailed analytics.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {[
                { label: 'Total Questions', value: courseInfo.totalQuestions },
                { label: 'Total Weeks', value: courseInfo.totalWeeks },
                { label: 'Your Attempts', value: totalAttempts },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-bold">{value}</div>
                  <div className="text-sm text-white/60">{label}</div>
                </div>
              ))}
            </div>

            <Link
              to="/full-test"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              <Zap className="w-5 h-5" />
              Start Full 120-Question Test
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Zap, title: 'Full Practice Test', desc: '10 to 120 questions', to: '/full-test', color: 'from-indigo-500 to-purple-500' },
            { icon: BarChart2, title: 'View Dashboard', desc: 'Progress & analytics', to: '/dashboard', color: 'from-purple-500 to-pink-500' },
            { icon: Star, title: 'Best Score', desc: avgScore > 0 ? `${avgScore}% avg score` : 'Not attempted yet', to: '/dashboard', color: 'from-amber-500 to-orange-500' },
          ].map(({ icon: Icon, title, desc, to, color }) => (
            <Link
              key={title}
              to={to}
              className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Week Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Practice by Week
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {weeks.map(({ week, title, topic, questionCount }) => {
              const progress = weekProgress[week];
              const bestScore = progress?.bestScore || 0;
              const attempts = progress?.attempts || 0;

              return (
                <div key={week} className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group">
                  {/* Week badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                      Week {week}
                    </span>
                    {attempts > 0 && (
                      <span className={`badge ${getScoreBg(bestScore)}`}>
                        <Star className="w-3 h-3" />
                        {bestScore}%
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 leading-snug line-clamp-2">
                    {topic}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {questionCount} questions
                    </span>
                    {attempts > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {attempts} attempt{attempts > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {attempts > 0 && (
                    <div className="progress-bar mb-3">
                      <div className="progress-fill" style={{ width: `${bestScore}%` }} />
                    </div>
                  )}

                  <Link
                    to={`/week/${week}`}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {attempts > 0 ? 'Practice Again' : 'Start Practice'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
