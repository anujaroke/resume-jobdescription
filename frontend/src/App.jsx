import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import Dashboard from './components/Dashboard';

function App() {
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900">AI Resume Matcher</h1>
        <p className="text-gray-600 mt-2">Optimize your resume for any job description</p>
      </header>

      <main>
        {!analysisData ? (
          <UploadForm onAnalysisComplete={setAnalysisData} />
        ) : (
          <Dashboard data={analysisData} onReset={() => setAnalysisData(null)} />
        )}
      </main>
    </div>
  );
}

export default App;
