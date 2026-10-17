import { useParams, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Send, RotateCcw, AlertTriangle } from 'lucide-react';
import { getWeekQuestions, getAllWeeks } from '../utils/dataUtils';
import QuestionCard from '../components/QuestionCard';
import ResultCard from '../components/ResultCard';
import useStore from '../store/useStore';

export default function WeekPracticePage() {
  const { weekNumber } = useParams();
  const week = parseInt(weekNumber);
  const navigate = useNavigate();
  const { startSession, setAnswer, clearAnswer, submitSession, currentSession, resetSession } = useStore();

  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [results, setResults] = useState(null);

  const weeks = getAllWeeks();
  const weekInfo = weeks.find((w) => w.week === week);
  const questions = getWeekQuestions(week);

  if (!weekInfo || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Week not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
      </div>
    );
  }

  const handleStart = () => {
    startSession(questions, 'week', week);
    setStarted(true);
    setCurrentQ(0);
  };

  const handleRetake = () => {
    resetSession();
    setStarted(false);
    setSubmitted(false);
    setResults(null);
    setCurrentQ(0);
  };

  const session = currentSession;
  const answers = session?.answers || {};

  const handleAnswer = useCallback((questionId, answer) => {
    if (answer === null || (Array.isArray(answer) && answer.length === 0)) {
      clearAnswer(questionId);
    } else {
      setAnswer(questionId, answer);
    }
  }, [setAnswer, clearAnswer]);

  const handleSubmit = () => {
    const res = submitSession();
    setResults(res);
    setSubmitted(true);
    setShowConfirm(false);
  };

  const attemptedCount = Object.keys(answers).length;
  const unattempted = questions.length - attemptedCount;

  // Pre-start screen
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-8 text-sm font-medium transition-colors">
          <ChevronLeft className="w-4 h-4" />Back to Home
        </button>
        <div className="card p-8 text-center animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <span className="text-white font-bold text-xl">W{week}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{weekInfo.topic}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{questions.length} questions • Select all correct answers for MSQ</p>
          <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
            {[
              ['Questions', questions.length],
              ['Points', questions.length],
              ['No negative marking', '✓'],
              ['Review after submit', '✓'],
            ].map(([label, val]) => (
              <div key={label} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="font-semibold text-gray-900 dark:text-white">{val}</div>
                <div className="text-gray-500 dark:text-gray-400">{label}</div>
              </div>
            ))}
          </div>
          <button onClick={handleStart} className="btn-primary w-full text-base py-3.5">
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (submitted && results) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-slide-up">
        <ResultCard results={results} onRetake={handleRetake} weekTitle={weekInfo.topic} />
      </div>
    );
  }

  // Quiz in progress
  const q = questions[currentQ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Sticky Header */}
      <div className="sticky top-16 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 -mx-4 px-4 pb-4 mb-6 pt-2">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 transition-colors">
            <ChevronLeft className="w-4 h-4" />Week {week}
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {attemptedCount}/{questions.length} answered
          </span>
        </div>

        {/* Progress bar */}
        <div className="progress-bar mb-3">
          <div className="progress-fill" style={{ width: `${(attemptedCount / questions.length) * 100}%` }} />
        </div>

        {/* Question navigator */}
        <div className="flex gap-1.5 flex-wrap">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentQ(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                i === currentQ
                  ? 'bg-indigo-600 text-white scale-110'
                  : answers[q.id] !== undefined
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <QuestionCard
          question={q}
          index={currentQ}
          userAnswer={answers[q.id]}
          onAnswer={handleAnswer}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
          disabled={currentQ === 0}
          className="btn-secondary flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />Previous
        </button>

        <button
          onClick={() => {
            if (answers[q.id] !== undefined) clearAnswer(q.id);
          }}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />Clear
        </button>

        {currentQ < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQ((p) => Math.min(questions.length - 1, p + 1))}
            className="btn-primary flex items-center gap-2"
          >
            Next<ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => setShowConfirm(true)} className="btn-primary flex items-center gap-2">
            <Send className="w-4 h-4" />Submit Quiz
          </button>
        )}
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card p-6 max-w-sm w-full animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Submit Quiz?</h3>
            {unattempted > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 mb-4 text-sm text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {unattempted} question{unattempted > 1 ? 's' : ''} unattempted
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              You've answered {attemptedCount} of {questions.length} questions. Submit and see your results?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSubmit} className="btn-primary flex-1">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
