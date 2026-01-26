import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Dashboard = ({ data, onReset }) => {
    const { isDark } = useTheme();
    const { match_score, missing_keywords, present_keywords, summary_suggestion, cover_letter } = data;

    const [coverText, setCoverText] = useState(cover_letter || '');
    const [copied, setCopied] = useState(null);

    const copyText = (text, key) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(key);
            setTimeout(() => setCopied(null), 1500);
        });
    };

    const downloadCover = () => {
        const blob = new Blob([coverText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cover_letter.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-10">
            {/* Score */}
            <div className={`text-center rounded-xl p-8 border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-stone-200 shadow-sm'}`}>
                <p className={`text-xs font-medium tracking-widest uppercase mb-3 ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                    Match Score
                </p>
                <div className={`text-6xl font-semibold tabular-nums ${
                    match_score >= 80 ? 'text-emerald-600' : match_score >= 50 ? 'text-amber-600' : 'text-red-600'
                }`}>
                    {match_score}%
                </div>
                
                {/* Score bar */}
                <div className={`mt-4 mx-auto w-48 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-stone-200'}`}>
                    <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                            match_score >= 80 ? 'bg-emerald-500' : match_score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${match_score}%` }}
                    ></div>
                </div>
                
                <p className={`mt-3 text-sm ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
                    {match_score >= 80 ? 'Strong match' : match_score >= 50 ? 'Decent fit—some gaps' : 'Needs improvement'}
                </p>
                {/* Quick stats */}
                <div className={`mt-6 flex items-center justify-center gap-6 text-xs ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                    <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${missing_keywords.length > 5 ? 'bg-red-500' : missing_keywords.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                        <span>{missing_keywords.length} missing</span>
                    </div>
                    <div className={`w-px h-3 ${isDark ? 'bg-zinc-700' : 'bg-stone-300'}`}></div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{present_keywords.length} matching</span>
                    </div>
                </div>
                
                <button
                    onClick={onReset}
                    className={`mt-6 text-sm underline underline-offset-4 ${isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-stone-500 hover:text-stone-700'}`}
                >
                    Analyze another resume
                </button>
            </div>

            {/* Keywords */}
            <div className={`grid md:grid-cols-2 gap-6 p-6 rounded-xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-stone-200 shadow-sm'}`}>
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>
                            Missing keywords ({missing_keywords.length})
                        </h3>
                        {missing_keywords.length > 0 && (
                            <button
                                onClick={() => copyText(missing_keywords.join(', '), 'missing')}
                                className={`text-xs ${isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-stone-500 hover:text-stone-700'}`}
                            >
                                {copied === 'missing' ? 'Copied' : 'Copy all'}
                            </button>
                        )}
                    </div>
                    {missing_keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {missing_keywords.map((kw, i) => (
                                <span
                                    key={i}
                                    className={`px-2.5 py-1 text-xs rounded-md ${isDark ? 'bg-red-950 text-red-300 border border-red-900' : 'bg-red-50 text-red-700 border border-red-200'}`}
                                >
                                    {kw}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>None—nice work!</p>
                    )}
                </div>
                <div className={`md:border-l md:pl-6 ${isDark ? 'border-zinc-800' : 'border-stone-200'}`}>
                    <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>
                        Matching keywords ({present_keywords.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {present_keywords.map((kw, i) => (
                            <span
                                key={i}
                                className={`px-2.5 py-1 text-xs rounded-md ${isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-900' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}
                            >
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-stone-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Suggested summary</h3>
                    <button
                        onClick={() => copyText(summary_suggestion, 'summary')}
                        className={`text-xs font-medium px-3 py-1.5 rounded-md border transition-all duration-200 ${
                            isDark 
                                ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 active:scale-95' 
                                : 'border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400 active:scale-95'
                        }`}
                    >
                        {copied === 'summary' ? '✓ Copied' : 'Copy'}
                    </button>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>
                    {summary_suggestion}
                </p>
            </div>

            {/* Cover Letter */}
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-stone-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <h3 className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Cover letter</h3>
                        <span className={`text-xs ${isDark ? 'text-zinc-600' : 'text-stone-400'}`}>
                            {coverText.split(/\s+/).filter(Boolean).length} words
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => copyText(coverText, 'cover')}
                            className={`text-xs font-medium px-3 py-1.5 rounded-md border transition-all duration-200 ${
                                isDark 
                                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 active:scale-95' 
                                    : 'border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400 active:scale-95'
                            }`}
                        >
                            {copied === 'cover' ? '✓ Copied' : 'Copy'}
                        </button>
                        <button
                            onClick={downloadCover}
                            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200 active:scale-95 ${
                                isDark 
                                    ? 'bg-zinc-100 text-zinc-900 hover:bg-white' 
                                    : 'bg-stone-900 text-stone-50 hover:bg-stone-800'
                            }`}
                        >
                            Download
                        </button>
                    </div>
                </div>
                <textarea
                    value={coverText}
                    onChange={(e) => setCoverText(e.target.value)}
                    rows="12"
                    className={`w-full rounded-lg border px-4 py-3 text-sm leading-relaxed transition-colors resize-none ${
                        isDark
                            ? 'bg-zinc-900 border-zinc-700 text-zinc-200 focus:border-zinc-500 focus:outline-none'
                            : 'bg-white border-stone-300 text-stone-900 focus:border-stone-500 focus:outline-none'
                    }`}
                />
            </div>

            {/* Export All */}
            <div className={`text-center pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-stone-200'}`}>
                <button
                    onClick={() => {
                        const report = `RESUME ANALYSIS REPORT\n${'='.repeat(50)}\n\nMatch Score: ${match_score}%\n\nMissing Keywords (${missing_keywords.length}):\n${missing_keywords.length > 0 ? missing_keywords.map(k => `  • ${k}`).join('\n') : '  None'}\n\nMatching Keywords (${present_keywords.length}):\n${present_keywords.map(k => `  • ${k}`).join('\n')}\n\nSuggested Summary:\n${summary_suggestion}\n\nCover Letter:\n${coverText}`;
                        const blob = new Blob([report], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'resume_analysis_report.txt';
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    className={`text-xs font-medium px-4 py-2 rounded-md border transition-all duration-200 ${
                        isDark 
                            ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 active:scale-95' 
                            : 'border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400 active:scale-95'
                    }`}
                >
                    Export full report (.txt)
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
