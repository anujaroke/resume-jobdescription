import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const UploadForm = ({ onAnalysisComplete }) => {
    const { isDark } = useTheme();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [jd, setJd] = useState("");
    const [jdCharCount, setJdCharCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const recommendedLength = 1200;
    const sampleJd = `We are seeking a Frontend Engineer to build delightful, performant user experiences.
Responsibilities include implementing accessible UI, collaborating with designers, and improving performance.
Must have 3+ years with React, TypeScript, testing (Jest/RTL), and CSS (Tailwind or CSS-in-JS).
Nice to have: experience with design systems, a11y, analytics instrumentation, and backend APIs.`;

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

    const lengthPercent = Math.min(100, Math.round((jdCharCount / recommendedLength) * 100));

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
            const response = await axios.post("http://localhost:8000/api/analyze", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            onAnalysisComplete(response.data);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(`Error: ${err.response.data.detail}`);
            } else {
                setError("An error occurred during analysis. Check backend console.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className={`rounded-2xl shadow-xl overflow-hidden border transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                    <h2 className="text-2xl font-bold text-white">Start Your Analysis</h2>
                    <p className="text-blue-100 mt-1 text-sm">Upload your resume and job description to get instant feedback</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className={`rounded-xl border p-4 shadow-sm flex items-center gap-3 transition-colors ${file ? isDark ? 'border-green-900 bg-green-900' : 'border-green-200 bg-green-50' : isDark ? 'border-slate-600 bg-slate-700' : 'border-gray-200 bg-gray-50'}`}>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${file ? isDark ? 'bg-green-800 text-green-400' : 'bg-green-100 text-green-600' : isDark ? 'bg-slate-600 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Step 1</p>
                                <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{file ? 'Resume uploaded' : 'Upload resume'}</p>
                            </div>
                        </div>

                        <div className={`rounded-xl border p-4 shadow-sm flex items-center gap-3 transition-colors ${jd ? isDark ? 'border-blue-900 bg-blue-900' : 'border-blue-200 bg-blue-50' : isDark ? 'border-slate-600 bg-slate-700' : 'border-gray-200 bg-gray-50'}`}>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${jd ? isDark ? 'bg-blue-800 text-blue-400' : 'bg-blue-100 text-blue-600' : isDark ? 'bg-slate-600 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4h9m-9 8h9M5 4h.01M5 12h.01M5 20h.01" />
                                </svg>
                            </div>
                            <div>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Step 2</p>
                                <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{jd ? 'JD captured' : 'Paste JD'}</p>
                            </div>
                        </div>

                        <div className={`rounded-xl border p-4 shadow-sm flex items-center gap-3 transition-colors ${isDark ? 'border-indigo-900 bg-indigo-900' : 'border-indigo-200 bg-indigo-50'}`}>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-indigo-800 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Step 3</p>
                                <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Analyze instantly</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>📄 Upload Resume</label>
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Drag & drop or click to browse</span>
                        </div>

                        <div
                            className={`relative border-2 border-dashed rounded-xl p-5 transition-all ${isDark ? (dragActive ? 'border-blue-400 bg-slate-700' : 'border-slate-600 bg-slate-800 hover:border-blue-300') : (dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300')}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                accept=".pdf,.docx"
                                onChange={handleFileChange}
                                className={`block w-full text-sm rounded-lg p-3 border transition-all cursor-pointer ${isDark ? 'bg-slate-600 border-slate-500 text-gray-300 file:bg-gradient-to-r file:from-blue-600 file:to-indigo-600 file:text-white file:border-0 file:rounded-lg file:px-6 file:py-3 file:mr-4 file:font-semibold file:text-sm file:cursor-pointer file:shadow-md file:transition-all hover:file:shadow-lg hover:file:scale-105' : 'bg-white border-gray-200 text-gray-600 file:bg-gradient-to-r file:from-blue-600 file:to-indigo-600 file:text-white file:border-0 file:rounded-lg file:px-6 file:py-3 file:mr-4 file:font-semibold file:text-sm file:cursor-pointer file:shadow-md file:transition-all hover:file:shadow-lg hover:file:scale-105'}`}
                            />
                            <div className={`mt-3 flex items-center justify-between text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                <span>Supported: PDF, DOCX</span>
                                <span>{dragActive ? 'Release to upload' : 'Secure & private'}</span>
                            </div>

                            {fileName && (
                                <div className={`mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${isDark ? 'bg-green-900 text-green-200 border-green-800' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{fileName}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>💼 Job Description</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setJd(sampleJd);
                                        setJdCharCount(sampleJd.length);
                                        setError("");
                                    }}
                                    className={`text-xs font-semibold rounded-lg px-3 py-2 transition-colors ${isDark ? 'text-blue-400 bg-slate-700 border border-slate-600 hover:bg-slate-600' : 'text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100'}`}
                                >
                                    Use sample JD
                                </button>
                                {jd && (
                                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{jd.split(/\s+/).filter(Boolean).length} words</span>
                                )}
                            </div>
                        </div>

                        <textarea
                            rows="9"
                            value={jd}
                            onChange={(e) => {
                                const value = e.target.value;
                                setJd(value);
                                setJdCharCount(value.length);
                            }}
                            placeholder="Paste the complete job description here...&#10;&#10;Include:&#10;• Job title and requirements&#10;• Required skills and qualifications&#10;• Preferred experience"
                            className={`mt-1 block w-full rounded-lg border-2 shadow-sm text-sm p-4 transition-all resize-none ${isDark ? 'bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20'}`}
                        />

                        <div className={`flex items-center justify-between text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span>{jdCharCount} / {recommendedLength} chars</span>
                            <span>{jdCharCount >= recommendedLength ? 'Great length for parsing' : `${recommendedLength - jdCharCount} to ideal length`}</span>
                        </div>
                        <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                            <div
                                className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all`}
                                style={{ width: `${lengthPercent}%` }}
                            ></div>
                        </div>
                    </div>

                    {error && (
                        <div className={`border-l-4 p-4 rounded transition-colors ${isDark ? 'bg-red-900 border-red-600' : 'bg-red-50 border-red-500'}`}>
                            <div className="flex items-center">
                                <svg className={`w-5 h-5 mr-2 ${isDark ? 'text-red-400' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className={`text-sm font-medium ${isDark ? 'text-red-200' : 'text-red-700'}`}>{error}</p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center gap-2 py-4 px-6 rounded-lg shadow-lg text-base font-semibold text-white transition-all transform ${loading ? `${isDark ? 'bg-slate-600 cursor-not-allowed' : 'bg-gray-400 cursor-not-allowed'}` : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300'}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Analyze Match</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadForm;
