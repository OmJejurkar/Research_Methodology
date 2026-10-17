import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shuffle, Clock, ChevronLeft, ChevronRight, Send, RotateCcw, AlertTriangle, Settings } from 'lucide-react';
import { getAllQuestions, shuffleArray } from '../utils/dataUtils';
import QuestionCard from '../components/QuestionCard';
import ResultCard from '../components/ResultCard';
import Timer from '../components/Timer';
import useStore from '../store/useStore';

const QUESTION_COUNTS = [10, 25, 50, 120];
const TIMER_OPTIONS = [
  { label: 'No Timer', value: 0 },
  { label: '1 min / question', value: -1 },
  { label: '30 minutes', value: 30 * 60 },
  { label: '60 minutes', value: 60 * 60 },
  { label: '90 minutes', value: 90 * 60 },
];

export default function FullTestPage() {
  const navigate = useNavigate();
  const { startSession, setAnswer, clearAnswer, submitSession, currentSession, resetSession } = useStore();

  const [configured, setConfigured] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  // Config state
  const [qCount, setQCount] = useState(120);
  const [shuffle, setShuffle] = useState(true);
  const [timerOption, setTimerOption] = useState(0);

  const handleStartTest = () => {
    let questions = getAllQuestions();
    if (shuffle) questions = shuffleArray(questions);
    questions = questions.slice(0, qCount);

    const timerSecs = timerOption === -1 ? qCount * 60 : timerOption;
    startSession(questions, 'full');
    setConfigured(true);
    setCurrentQ(0);
  };

  const handleRetake = () => {
    resetSession();
    setConfigured(false);
    setSubmitted(false);
    setResults(null);
    setCurrentQ(0);
  };

  const session = currentSession;
  const answers = session?.answers || {};
  const questions = session?.questions || [];

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
  const timerSecs = timerOption === -1 ? qCount * 60 : timerOption;

  // Config screen
  if (!configured) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="card p-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Full Practice Test</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure your test session</p>
            </div>
          </div>

          {/* Question count */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Number of Questions
            </label>
            <div className="grid grid-cols-4 gap-2">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setQCount(n)}
                  className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                    qCount === n
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Shuffle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center gap-3">
              <Shuffle className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">Shuffle Questions</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Randomize question order</div>
              </div>
            </div>
            <button
              onClick={() => setShuffle((s) => !s)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${shuffle ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${shuffle ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Timer */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <Clock className="w-4 h-4 inline mr-1" />Timer Option
            </label>
            <div className="space-y-2">
              {TIMER_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setTimerOption(value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    timerOption === value
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleStartTest} className="btn-primary w-full text-base py-3.5">
            Start Test ({qCount} Questions)
          </button>
        </div>
      </div>
    );
  }

  // Results
  if (submitted && results) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-slide-up">
        <ResultCard results={results} onRetake={handleRetake} weekTitle="Full Practice Test" />
      </div>
    );
  }

  const q = questions[currentQ];
  if (!q) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Sticky header */}
      <div className="sticky top-16 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 -mx-4 px-4 pb-4 mb-6 pt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Full Test · {attemptedCount}/{questions.length} answered
          </span>
          {timerSecs > 0 && (
            <Timer totalSeconds={timerSecs} onTimeUp={() => { setShowConfirm(true); }} />
          )}
        </div>

        <div className="progress-bar mb-3">
          <div className="progress-fill" style={{ width: `${(attemptedCount / questions.length) * 100}%` }} />
        </div>

        <div className="flex gap-1 flex-wrap max-h-16 overflow-y-auto scrollbar-hide">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentQ(i)}
              className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                i === currentQ
                  ? 'bg-indigo-600 text-white scale-110'
                  : answers[q.id] !== undefined
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
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

      {/* Nav */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
          disabled={currentQ === 0}
          className="btn-secondary flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />Prev
        </button>

        <button
          onClick={() => { if (answers[q.id] !== undefined) clearAnswer(q.id); }}
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
            <Send className="w-4 h-4" />Submit
          </button>
        )}
      </div>

      {/* Confirm */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card p-6 max-w-sm w-full animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Submit Test?</h3>
            {unattempted > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 mb-4 text-sm text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {unattempted} question{unattempted > 1 ? 's' : ''} unattempted
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              {attemptedCount} of {questions.length} answered. Submit now?
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
