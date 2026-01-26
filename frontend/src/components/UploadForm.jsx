import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const UploadForm = ({ onAnalysisComplete }) => {
    const { isDark } = useTheme();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [jd, setJd] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const formatBytes = (bytes) => {
        if (!bytes) return "";
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
        const value = bytes / Math.pow(1024, i);
        return `${value.toFixed(value >= 10 ? 0 : 1)} ${sizes[i]}`;
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setFileName(selected ? `${selected.name} (${formatBytes(selected.size)})` : "");
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => setDragActive(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const dropped = e.dataTransfer.files && e.dataTransfer.files[0];
        if (dropped) {
            setFile(dropped);
            setFileName(`${dropped.name} (${formatBytes(dropped.size)})`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !jd) {
            setError("Please provide both a resume and a job description.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("job_description", jd);

        try {
            const response = await axios.post(`${API_BASE}/api/analyze`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onAnalysisComplete(response.data);
        } catch (err) {
            console.error(err);
            if (err.response?.data?.detail) {
                setError(`Error: ${err.response.data.detail}`);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`rounded-xl p-6 md:p-8 border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-stone-200 shadow-sm'}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume Upload */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className={`block text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>
                        Resume
                    </label>
                    <div className="flex gap-1.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-stone-100 text-stone-500'}`}>PDF</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-stone-100 text-stone-500'}`}>DOCX</span>
                    </div>
                </div>
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                        dragActive
                            ? isDark ? 'border-zinc-500 bg-zinc-800/50 scale-[1.01]' : 'border-stone-400 bg-stone-100 scale-[1.01]'
                            : isDark ? 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/30' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    <input
                        id="file-input"
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {fileName ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-stone-100'}`}>
                                <svg className={`w-5 h-5 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <div className={`flex items-center gap-2 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                                <span className="font-medium text-sm">{fileName}</span>
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setFile(null); setFileName(''); }}
                                className={`text-xs mt-1 ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-stone-400 hover:text-stone-600'}`}
                            >
                                Remove file
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-stone-100'}`}>
                                <svg className={`w-5 h-5 ${isDark ? 'text-zinc-500' : 'text-stone-400'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                            </div>
                            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
                                Drop your file here, or <span className={`underline underline-offset-2 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>browse</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Job Description */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className={`block text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>
                        Job Description
                    </label>
                    <div className="flex items-center gap-3">
                        {jd && (
                            <>
                                <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                                    {jd.split(/\s+/).filter(Boolean).length} words
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setJd('')}
                                    className={`text-xs ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-stone-400 hover:text-stone-600'}`}
                                >
                                    Clear
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <textarea
                    rows="10"
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    placeholder="Paste the job description here..."
                    className={`w-full rounded-lg border px-4 py-3 text-sm transition-colors resize-none ${
                        isDark
                            ? 'bg-zinc-900 border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none'
                            : 'bg-white border-stone-300 text-stone-900 placeholder-stone-400 focus:border-stone-500 focus:outline-none'
                    }`}
                />
                {jd.length > 0 && (
                    <p className={`mt-2 text-xs ${isDark ? 'text-zinc-600' : 'text-stone-400'}`}>
                        Tip: Include the full job posting for best results
                    </p>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className={`text-sm px-4 py-3 rounded-lg ${isDark ? 'bg-red-950 text-red-300 border border-red-900' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {error}
                </div>
            )}

            {/* Divider */}
            <div className={`border-t ${isDark ? 'border-zinc-800' : 'border-stone-200'}`}></div>

            {/* Submit */}
            <div>
                <button
                    type="submit"
                    disabled={loading || !file || !jd}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                        loading || !file || !jd
                            ? isDark ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : isDark ? 'bg-zinc-100 text-zinc-900 hover:bg-white active:scale-[0.98]' : 'bg-stone-900 text-stone-50 hover:bg-stone-800 active:scale-[0.98]'
                    }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </span>
                    ) : 'Analyze Resume'}
                </button>
                {!loading && file && jd && (
                    <p className={`mt-2 text-center text-xs ${isDark ? 'text-zinc-600' : 'text-stone-400'}`}>
                        Press Enter or click to analyze
                    </p>
                )}
            </div>
        </form>
        </div>
    );
};

export default UploadForm;
