import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, Filter, CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import useStore from '../store/useStore';

const FILTER_OPTIONS = [
  { label: 'All', value: 'all', icon: null },
  { label: 'Correct', value: 'correct', icon: CheckCircle, color: 'text-green-600' },
  { label: 'Wrong', value: 'wrong', icon: XCircle, color: 'text-red-600' },
  { label: 'Skipped', value: 'skipped', icon: MinusCircle, color: 'text-gray-400' },
];

export default function ReviewPage() {
  const navigate = useNavigate();
  const { currentSession } = useStore();
  const [filter, setFilter] = useState('all');

  if (!currentSession || !currentSession.submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No submitted session to review.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
      </div>
    );
  }

  const { questions, answers, results } = currentSession;
  const { detailedResults } = results;

  const filtered = detailedResults.filter((r) => {
    if (filter === 'correct') return r.isCorrect;
    if (filter === 'wrong') return r.isAttempted && !r.isCorrect;
    if (filter === 'skipped') return !r.isAttempted;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />Back
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Review Answers</h1>
      </div>

      {/* Score summary */}
      <div className="card p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex gap-4 flex-1">
          {[
            { label: 'Correct', val: results.correct, cls: 'text-green-600' },
            { label: 'Wrong', val: results.wrong, cls: 'text-red-600' },
            { label: 'Skipped', val: results.unattempted, cls: 'text-gray-400' },
            { label: 'Score', val: `${results.percentage}%`, cls: 'text-indigo-600 font-bold' },
          ].map(({ label, val, cls }) => (
            <div key={label} className="text-center">
              <div className={`text-xl font-bold ${cls}`}>{val}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Filter className="w-4 h-4 text-gray-400 self-center" />
        {FILTER_OPTIONS.map(({ label, value, icon: Icon, color }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
              filter === value
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
            }`}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 ${color}`} />}
            {label}
            {value === 'correct' && <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 rounded-full">{results.correct}</span>}
            {value === 'wrong' && <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-1.5 rounded-full">{results.wrong}</span>}
            {value === 'skipped' && <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 rounded-full">{results.unattempted}</span>}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">No questions in this category</div>
        ) : (
          filtered.map((result, i) => (
            <QuestionCard
              key={result.question.id}
              question={result.question}
              index={questions.findIndex(q => q.id === result.question.id)}
              userAnswer={result.userAnswer}
              reviewMode={true}
            />
          ))
        )}
      </div>
    </div>
  );
}
