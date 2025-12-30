import React from 'react';

const Dashboard = ({ data, onReset }) => {
    const { match_score, missing_keywords, present_keywords, summary_suggestion, cover_letter } = data;

    // Color for score
    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600";
        if (score >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">

            {/* Header / Score */}
            <div className="bg-white p-6 rounded-lg shadow text-center">
                <h2 className="text-xl font-semibold text-gray-700">Match Score</h2>
                <div className={`text-6xl font-bold my-4 ${getScoreColor(match_score)}`}>
                    {match_score}%
                </div>
                <button onClick={onReset} className="text-blue-600 hover:underline">
                    Analyze Another
                </button>
            </div>

            {/* Keywords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-red-600 mb-3">Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                        {missing_keywords.length > 0 ? (
                            missing_keywords.map((kw, i) => (
                                <span key={i} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                    {kw}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No critical keywords missing!</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-green-600 mb-3">Matching Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                        {present_keywords.map((kw, i) => (
                            <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-3">AI Suggestions</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-700">Profile Summary</h4>
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">{summary_suggestion}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700">Draft Cover Letter (Editable)</h4>
                        <textarea
                            className="w-full h-64 p-3 text-sm text-gray-700 border rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono"
                            defaultValue={cover_letter}
                            id="coverLink"
                        ></textarea>
                        <div className="mt-2 text-right">
                            <button
                                onClick={() => {
                                    const text = document.getElementById('coverLink').value;
                                    const element = document.createElement("a");
                                    const file = new Blob([text], { type: 'text/plain' });
                                    element.href = URL.createObjectURL(file);
                                    element.download = "cover_letter.txt";
                                    document.body.appendChild(element);
                                    element.click();
                                    document.body.removeChild(element);
                                }}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Download .txt
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
