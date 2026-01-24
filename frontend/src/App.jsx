import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import Dashboard from './components/Dashboard';
import { useTheme } from './context/ThemeContext';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className={`min-h-screen bg-gradient-to-br ${isDark ? 'from-slate-900 via-slate-800 to-slate-900' : 'from-blue-50 via-white to-indigo-50'} py-8 px-4 transition-colors duration-300`}>
      <header className="mb-12 relative">
        <button
          onClick={toggleTheme}
          className={`absolute right-0 top-0 p-2.5 rounded-xl shadow-lg transition-all transform hover:scale-110 ${isDark ? 'bg-gradient-to-br from-yellow-300 to-orange-400 text-gray-900 hover:from-yellow-200 hover:to-orange-300' : 'bg-gradient-to-br from-slate-700 to-slate-800 text-blue-300 hover:from-slate-600 hover:to-slate-700'}`}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.3"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
              AI Resume Matcher
            </h1>
          </div>
        </div>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg max-w-2xl mx-auto text-center`}>
          Optimize your resume with AI-powered analysis and get personalized recommendations
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        {!analysisData ? (
          <UploadForm onAnalysisComplete={setAnalysisData} />
        ) : (
          <Dashboard data={analysisData} onReset={() => setAnalysisData(null)} />
        )}
      </main>

      <footer className={`mt-16 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
        <p>Powered by AI • Built with React & FastAPI • Developed by Anuj</p>
      </footer>
      </div>
    </div>
  );
}

export default App;
