import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Dashboard = ({ data, onReset }) => {
    const { isDark } = useTheme();
    const { match_score, missing_keywords, present_keywords, summary_suggestion, cover_letter } = data;

    // Color for score
    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600";
        if (score >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    const [coverText, setCoverText] = useState(cover_letter || '');
    const [copiedCover, setCopiedCover] = useState(false);
    const [copiedMissing, setCopiedMissing] = useState(false);
    const [copiedSummary, setCopiedSummary] = useState(false);

    const copyWithToast = (text, setter) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setter(true);
            setTimeout(() => setter(false), 1400);
        });
    };

    const missingListText = missing_keywords.join(', ');
    const summaryText = summary_suggestion || '';

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header / Score */}
            <div className={`p-8 rounded-2xl shadow-xl text-center border relative overflow-hidden transition-colors ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'}`}>
                <div className={`absolute top-0 left-0 w-full h-1 ${isDark ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}></div>
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Your Match Score</h2>
                <div className="relative inline-block">
                    <svg className="w-48 h-48 transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                        <circle 
                            cx="96" 
                            cy="96" 
                            r="88" 
                            stroke={match_score >= 80 ? '#10b981' : match_score >= 50 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="12" 
                            fill="none"
                            strokeDasharray={`${match_score * 5.53} 553`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div>
                            <div className={`text-6xl font-bold ${getScoreColor(match_score)}`}>
                                {match_score}%
                            </div>
                            <div className={`text-sm font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {match_score >= 80 ? 'Excellent' : match_score >= 50 ? 'Good' : 'Needs Work'}
                            </div>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onReset} 
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Analyze Another Resume
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`rounded-2xl p-5 shadow-md border flex items-center gap-3 transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className={`w-12 h-12 rounded-xl font-bold text-lg flex items-center justify-center ${isDark ? 'bg-red-900 text-red-400' : 'bg-red-50 text-red-600'}`}>
                        {missing_keywords.length}
                    </div>
                    <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Missing Keywords</p>
                        <p className={`text-base font-semibold ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Action needed</p>
                    </div>
                </div>

                <div className={`rounded-2xl p-5 shadow-md border flex items-center gap-3 transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className={`w-12 h-12 rounded-xl font-bold text-lg flex items-center justify-center ${isDark ? 'bg-green-900 text-green-400' : 'bg-green-50 text-green-600'}`}>
                        {present_keywords.length}
                    </div>
                    <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Matching Keywords</p>
                        <p className={`text-base font-semibold ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Good coverage</p>
                    </div>
                </div>

                <div className={`rounded-2xl p-5 shadow-md border flex items-center gap-3 transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>AI Suggestions</p>
                        <p className={`text-base font-semibold ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Ready to apply</p>
                    </div>
                </div>
            </div>

            {/* Keywords Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl shadow-lg border hover:shadow-xl transition-all ${isDark ? 'bg-slate-800 border-red-900' : 'bg-white border-red-100'}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-red-900' : 'bg-red-100'}`}>
                            <svg className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>Missing Keywords</h3>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Add these to improve your score</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {missing_keywords.length > 0 ? (
                            missing_keywords.map((kw, i) => (
                                <span key={i} className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${isDark ? 'bg-red-900 text-red-200 border-red-800 hover:bg-red-800' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}>
                                    {kw}
                                </span>
                            ))
                        ) : (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'text-green-400 bg-green-900' : 'text-green-600 bg-green-50'}`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-medium">No critical keywords missing!</p>
                            </div>
                        )}
                    </div>

                    {missing_keywords.length > 0 && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => copyWithToast(missingListText, setCopiedMissing)}
                                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isDark ? 'text-red-400 bg-red-900 border border-red-800 hover:bg-red-800' : 'text-red-700 bg-red-50 border border-red-200 hover:bg-red-100'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 11h12M8 15h12M4 7h.01M4 11h.01M4 15h.01" />
                                </svg>
                                {copiedMissing ? 'Copied!' : 'Copy Missing' }
                            </button>
                        </div>
                    )}
                </div>

                <div className={`p-6 rounded-2xl shadow-lg border hover:shadow-xl transition-all ${isDark ? 'bg-slate-800 border-green-900' : 'bg-white border-green-100'}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-green-900' : 'bg-green-100'}`}>
                            <svg className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>Matching Keywords</h3>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>You're already using these</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {present_keywords.map((kw, i) => (
                            <span key={i} className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${isDark ? 'bg-green-900 text-green-200 border-green-800 hover:bg-green-800' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}>
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Suggestions */}
            <div className={`rounded-2xl shadow-xl border transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                <div className={`bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-2xl ${isDark ? 'shadow-xl' : ''}`}>
                    <div className="flex items-center gap-2">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <h3 className="text-xl font-bold text-white">AI-Powered Suggestions</h3>
                    </div>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className={`p-5 rounded-xl border transition-colors ${isDark ? 'bg-slate-700 border-indigo-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
                        <div className="flex items-start gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${isDark ? 'bg-indigo-700' : 'bg-blue-600'}`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                    <h4 className={`font-bold text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Optimized Profile Summary</h4>
                                    <button
                                        onClick={() => copyWithToast(summaryText, setCopiedSummary)}
                                        className={`inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-3 py-2 transition-colors ${isDark ? 'text-indigo-400 bg-slate-600 border border-slate-500 hover:bg-slate-600' : 'text-blue-700 bg-white border border-blue-200 hover:bg-blue-50'}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 11h12M8 15h12M4 7h.01M4 11h.01M4 15h.01" />
                                        </svg>
                                        {copiedSummary ? 'Copied!' : 'Copy summary'}
                                    </button>
                                </div>
                                <p className={`leading-relaxed p-4 rounded-lg shadow-sm border ${isDark ? 'bg-slate-600 text-gray-300 border-slate-500' : 'bg-white text-gray-700 border-blue-100'}`}>{summaryText}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`p-5 rounded-xl border transition-colors ${isDark ? 'bg-slate-700 border-purple-900' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'}`}>
                        <div className="flex items-start gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-purple-700' : 'bg-purple-600'}`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Personalized Cover Letter</h4>
                                <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Edit and customize this AI-generated cover letter</p>
                            </div>
                        </div>
                        <textarea
                            className={`w-full h-72 p-4 text-sm rounded-xl border-2 transition-all shadow-sm ${isDark ? 'bg-slate-600 border-slate-500 text-gray-200 placeholder-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-20' : 'bg-white border-purple-200 text-gray-700 focus:ring-4 focus:ring-purple-200 focus:border-purple-400'}`}
                            value={coverText}
                            onChange={(e) => setCoverText(e.target.value)}
                            id="coverLink"
                        ></textarea>
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => {
                                    const element = document.createElement("a");
                                    const file = new Blob([coverText], { type: 'text/plain' });
                                    element.href = URL.createObjectURL(file);
                                    element.download = "cover_letter.txt";
                                    document.body.appendChild(element);
                                    element.click();
                                    document.body.removeChild(element);
                                }}
                                className="flex-1 inline-flex justify-center items-center gap-2 py-3 px-6 border-2 border-transparent shadow-lg text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-purple-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Cover Letter
                            </button>
                            <button
                                onClick={() => copyWithToast(coverText, setCopiedCover)}
                                className={`inline-flex justify-center items-center gap-2 py-3 px-6 border-2 shadow-md text-sm font-semibold rounded-lg transition-all focus:outline-none ${isDark ? 'text-indigo-400 border-slate-500 bg-slate-700 hover:bg-slate-600 focus:ring-4 focus:ring-indigo-400' : 'text-purple-700 border-purple-300 bg-white hover:bg-purple-50 focus:ring-4 focus:ring-purple-200'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                {copiedCover ? 'Copied!' : 'Copy to Clipboard'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
