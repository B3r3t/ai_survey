import React from 'react';
import { Clock, Shield, FileText, ChevronRight } from 'lucide-react';

interface IntroScreenProps {
    onStart: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-gray-cloud via-white to-brand-gray-cloud flex items-center justify-center p-4">
            <div className="bg-white border border-brand-gray-smoke rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
                <div className="bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 text-center border-b border-brand-gray-smoke">
                    <div className="flex justify-center mb-6">
                        <img
                            src="https://dhqupibzlgpkwagmkjtg.supabase.co/storage/v1/object/public/images/Asset%201@4x-8.png"
                            alt="AGNTMKT Logo"
                            className="h-16 md:h-20 object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const textLogo = e.currentTarget.nextElementSibling;
                                if (textLogo) {
                                    (textLogo as HTMLElement).style.display = 'block';
                                }
                            }}
                        />
                        <div style={{ display: 'none' }} className="text-center">
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-4xl font-bold text-brand-orange">AGNT</span>
                                <span className="text-4xl font-bold text-brand-dark-bg">MKT</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-brand-dark-bg mb-4">
                        2025 AI in Franchising Survey
                    </h1>

                    <p className="text-base md:text-lg text-brand-gray-graphite leading-relaxed max-w-3xl mx-auto">
                        Thank you for contributing to our third annual AI in Franchising survey. Our goal is to share
                        how AI is being used across the franchise industry. This survey covers topics like usage, tools,
                        implementation, investment, and more. Thank you for taking the time to share your feedback.
                    </p>
                </div>

                <div className="p-8 md:p-12">
                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                        <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <div className="w-14 h-14 bg-brand-orange rounded-xl flex items-center justify-center mb-4 shadow-md">
                                <Clock className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-bold text-brand-dark-bg mb-2 text-lg">15-20 Minutes</h3>
                            <p className="text-sm text-brand-gray-graphite">Complete at your own pace with auto-save</p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                            <div className="w-14 h-14 bg-brand-orange rounded-xl flex items-center justify-center mb-4 shadow-md">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-bold text-brand-dark-bg mb-2 text-lg">Confidential</h3>
                            <p className="text-sm text-brand-gray-graphite">Your responses are secure and anonymous</p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                            <div className="w-14 h-14 bg-brand-orange rounded-xl flex items-center justify-center mb-4 shadow-md">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-bold text-brand-dark-bg mb-2 text-lg">Free Report</h3>
                            <p className="text-sm text-brand-gray-graphite">Receive the complete 2025 findings</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-r-lg mb-8">
                        <div className="flex items-start">
                            <Shield className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    <strong className="font-semibold">Privacy Notice:</strong> All responses are confidential
                                    and will be aggregated for the industry report. We do not share individual responses with
                                    third parties.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onStart}
                        className="w-full bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-brand-orange text-white font-bold py-5 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center group"
                    >
                        <span className="text-xl">Start Survey</span>
                        <ChevronRight className="w-7 h-7 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-center text-sm text-brand-gray-graphite mt-6">
                        Need help? Email us at{' '}
                        <a href="mailto:info@agntmkt.com" className="text-brand-orange hover:underline font-medium">
                            info@agntmkt.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IntroScreen;
