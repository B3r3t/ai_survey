import React from 'react';
import { Award, Download, CheckCircle } from 'lucide-react';
import { Responses } from '../types';

interface CompletionScreenProps {
    responses: Responses | null;
    submissionSuccess?: boolean;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ responses, submissionSuccess = false }) => {
    
    const handleDownload = () => {
        if (!responses) return;

        const headers = Object.keys(responses);
        const values = headers.map(header => {
            const value = responses[header as keyof Responses];
            if (Array.isArray(value)) {
                return `"${value.join(', ')}"`;
            }
            if (typeof value === 'object' && value !== null) {
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            return `"${String(value).replace(/"/g, '""')}"`;
        });

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(',') + "\n" 
            + values.join(',');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "survey_responses.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white border border-brand-gray-smoke p-8 rounded-xl shadow-lg text-center w-full max-w-lg animate-fade-in">
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
                    <Award className="w-8 h-8 text-green-600" />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-brand-dark-bg mb-2">Thank You!</h1>
            {submissionSuccess ? (
                <div className="mb-6">
                    <div className="flex items-center justify-center text-green-600 mb-2">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <p className="font-semibold">Survey submitted successfully!</p>
                    </div>
                    <p className="text-brand-gray-graphite">
                        Your responses have been saved to our database.
                    </p>
                </div>
            ) : (
                <p className="text-brand-gray-graphite mb-6">
                    Your survey has been completed.
                </p>
            )}
            {responses && (
                 <button 
                    onClick={handleDownload}
                    className="flex items-center justify-center w-full px-6 py-3 font-bold text-white bg-brand-orange rounded-lg hover:opacity-90 transition-opacity mb-4"
                >
                    <Download className="w-5 h-5 mr-2" />
                    Download Responses (CSV)
                </button>
            )}
            <p className="text-sm text-brand-gray-graphite">
                You will receive the 2025 AI in Franchising Report via email when it's published.
            </p>
        </div>
    );
};

export default CompletionScreen;