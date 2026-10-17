import { BookOpen, Database, CheckCircle, AlertTriangle, Info, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  const weeks = [
    { week: 1, title: 'Overview of Research', questions: 10, type: 'MCQ/TF', status: 'complete' },
    { week: 2, title: 'Literature Survey & Experimental Skills', questions: 10, type: 'MCQ/MSQ', status: 'complete' },
    { week: 3, title: 'Data Analysis & Modelling Skills', questions: 10, type: 'MCQ/MSQ', status: 'complete' },
    { week: 4, title: 'Technical Presentation & Writing', questions: 10, type: 'MCQ/TF/MSQ', status: 'complete' },
    { week: 5, title: 'Creativity in Research', questions: 10, type: 'MCQ/MSQ/TF', status: 'complete' },
    { week: 6, title: 'Intellectual Property Rights', questions: 10, type: 'MCQ', status: 'complete' },
    { week: 7, title: 'Design of Experiments', questions: 10, type: 'MCQ/TF/MSQ', status: 'complete' },
    { week: 8, title: 'Department Specific Discussions', questions: 10, type: 'MCQ/TF', status: 'complete' },
    { week: 9, title: 'The Research Journey', questions: 10, type: 'MCQ/MSQ', status: 'complete' },
    { week: 10, title: 'Imagination in Research', questions: 10, type: 'MCQ/MSQ', status: 'complete' },
    { week: 11, title: 'Role of AI in Research', questions: 10, type: 'MSQ', status: 'complete' },
    { week: 12, title: 'Hypothesis Generation & Metacognition', questions: 10, type: 'MSQ', status: 'complete' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Info className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">About This Application</h1>
        <p className="text-gray-500 dark:text-gray-400">
          MCQ Practice Website for NPTEL Research Methodology (SWAYAM)
        </p>
      </div>

      {/* Data source note */}
      <div className="card p-5 mb-6 border-l-4 border-indigo-500">
        <div className="flex gap-3">
          <Database className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Data Source</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All 120 questions have been extracted directly from the 12 weekly assignment PDFs of the 
              <strong> NPTEL Research Methodology</strong> course on SWAYAM. No questions have been invented or fabricated.
              Each question, its options, and the accepted answer were transcribed verbatim from the source PDFs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Features</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {[
              'Week-wise practice (10 MCQs per week)',
              'Full 120-question practice test',
              'Configurable question count (10/25/50/120)',
              'Question shuffle / randomize option',
              'Optional countdown timer with pause',
              'Instant feedback after submission',
              'Detailed answer review with color coding',
              'Expandable explanations for each question',
              'Score tracking and history (localStorage)',
              'Dark mode support',
              'Fully responsive design',
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>{f}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Question Types</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <li><span className="font-semibold text-gray-800 dark:text-gray-200">MCQ:</span> Single correct answer — select one option</li>
            <li><span className="font-semibold text-gray-800 dark:text-gray-200">MSQ:</span> Multiple correct answers — select all that apply</li>
            <li><span className="font-semibold text-gray-800 dark:text-gray-200">TF:</span> True/False questions</li>
          </ul>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
            <strong>MSQ scoring:</strong> For MSQ questions, all correct options must be selected (and no wrong options) to receive full credit.
          </div>
        </div>
      </div>

      {/* Week table */}
      <div className="card overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Course Structure (120 Questions)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Week</th>
                <th className="px-4 py-3 text-left">Topic</th>
                <th className="px-4 py-3 text-center">Questions</th>
                <th className="px-4 py-3 text-center">Type</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {weeks.map(({ week, title, questions, type, status }) => (
                <tr key={week} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-indigo-600 dark:text-indigo-400">W{week}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{title}</td>
                  <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{questions}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="badge bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">{type}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="badge bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      <CheckCircle className="w-3 h-3" />Extracted
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tech stack */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {['React 18', 'Vite', 'Tailwind CSS v4', 'React Router v6', 'Zustand', 'Lucide React', 'localStorage'].map((tech) => (
            <span key={tech} className="badge bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-3 py-1">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
