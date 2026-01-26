import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import Dashboard from './components/Dashboard';
import { useTheme } from './context/ThemeContext';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className={`min-h-screen ${isDark ? 'bg-zinc-950' : 'bg-stone-50'} py-10 px-5 transition-colors`}>

      <header className="mb-14 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <span className={`text-xs font-medium tracking-widest uppercase ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
            Resume Matcher
          </span>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md border transition-all duration-200 ${isDark ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/50' : 'border-stone-300 text-stone-500 hover:text-stone-700 hover:border-stone-400 hover:bg-stone-100'}`}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </div>
        
        <h1 className={`text-3xl md:text-4xl font-semibold tracking-tight mb-4 ${isDark ? 'text-zinc-100' : 'text-stone-900'}`}>
          Match your resume to <span className={`underline decoration-2 decoration-emerald-500/60 underline-offset-4`}>any job</span>
        </h1>
        <p className={`text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>
          Upload your resume and paste a job description. Get a match score, missing keywords, and a tailored cover letter-no fluff, just results.
        </p>
        
        {!analysisData && (
          <div className={`mt-8 flex items-center gap-6 text-xs ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-stone-200 text-stone-500'}`}>1</span>
              <span>Upload</span>
            </div>
            <div className={`w-8 h-px ${isDark ? 'bg-zinc-800' : 'bg-stone-200'}`}></div>
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-stone-200 text-stone-500'}`}>2</span>
              <span>Paste JD</span>
            </div>
            <div className={`w-8 h-px ${isDark ? 'bg-zinc-800' : 'bg-stone-200'}`}></div>
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-stone-200 text-stone-500'}`}>3</span>
              <span>Get results</span>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-2xl mx-auto">
        {!analysisData ? (
          <UploadForm onAnalysisComplete={setAnalysisData} />
        ) : (
          <Dashboard data={analysisData} onReset={() => setAnalysisData(null)} />
        )}
      </main>

      <footer className={`mt-20 text-center text-xs ${isDark ? 'text-zinc-600' : 'text-stone-400'}`}>
        <p>Built with React & FastAPI · Developed by Anuj</p>
      </footer>
      </div>
    </div>
  );
}

export default App;
