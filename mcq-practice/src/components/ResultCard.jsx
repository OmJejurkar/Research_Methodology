import { CheckCircle, XCircle, MinusCircle, Trophy, RotateCcw, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getScoreBg } from '../utils/dataUtils';

export default function ResultCard({ results, onRetake, weekTitle }) {
  const navigate = useNavigate();
  const { total, correct, wrong, unattempted, percentage } = results;

  const stats = [
    { label: 'Correct', value: correct, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' },
    { label: 'Wrong', value: wrong, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' },
    { label: 'Unattempted', value: unattempted, icon: MinusCircle, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700' },
  ];

  const grade = percentage >= 90 ? 'Excellent!' : percentage >= 75 ? 'Great Job!' : percentage >= 60 ? 'Good Effort!' : percentage >= 40 ? 'Keep Practicing!' : 'Needs Improvement';

  return (
    <div className="card p-8 text-center animate-slide-up">
      {/* Trophy */}
      <div className="flex justify-center mb-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
          percentage >= 75 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          <Trophy className={`w-10 h-10 ${percentage >= 75 ? 'text-yellow-500' : 'text-gray-400'}`} />
        </div>
      </div>

      {weekTitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{weekTitle}</p>
      )}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{grade}</h2>

      {/* Score circle */}
      <div className="flex justify-center mb-6">
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-8 ${
          percentage >= 80 ? 'border-green-400' : percentage >= 60 ? 'border-yellow-400' : 'border-red-400'
        } bg-white dark:bg-gray-900`}>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{percentage}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{correct}/{total}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`p-3 rounded-xl border ${bg}`}>
            <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
            <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => navigate('/review', { state: { fromResults: true } })}
          className="btn-secondary flex items-center gap-2 justify-center"
        >
          <Eye className="w-4 h-4" />
          Review Answers
        </button>
        {onRetake && (
          <button onClick={onRetake} className="btn-primary flex items-center gap-2 justify-center">
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </button>
        )}
      </div>
    </div>
  );
}
