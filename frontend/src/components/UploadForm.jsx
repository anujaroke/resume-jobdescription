import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ onAnalysisComplete }) => {
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
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
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Analyze Your Resume</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Resume (PDF/DOCX)</label>
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Job Description</label>
                    <textarea
                        rows="6"
                        value={jd}
                        onChange={(e) => setJd(e.target.value)}
                        placeholder="Paste the job description here..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                >
                    {loading ? "Analyzing..." : "Analyze Match"}
                </button>
            </form>
        </div>
    );
};

export default UploadForm;
