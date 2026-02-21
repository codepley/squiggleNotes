
interface Props {
    noteId: string | null;
    digitalText?: string;
    aiInsights?: string;
    isProcessing?: boolean;
    zoom?: number;
}

export default function DigitalInsightsView({
    noteId,
    digitalText,
    aiInsights,
    zoom = 1
}: Props) {
    if (!noteId) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center max-w-[400px] mx-auto">
                <p className="leading-relaxed">No note selected.</p>
            </div>
        );
    }

    const hasDigitalContent = digitalText || aiInsights;

    return (
        <div className="w-full h-full bg-gray-50 overflow-y-auto p-10 flex flex-col" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 m-0 mb-2">Digital Conversion & AI Insights</h2>
                <p className="text-gray-500 m-0 text-[15px]">
                    Text extraction and AI analysis for this note.
                </p>
            </div>

            <div className="flex-1">
                {!hasDigitalContent ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center max-w-[400px] mx-auto">
                        <div className="text-5xl mb-4">📝🤖</div>
                        <h3 className="text-gray-700 m-0 mb-2 text-lg font-semibold">No Digital Data Yet</h3>
                        <p className="leading-relaxed">Click "Extract Handwriting" in the top bar to convert your canvas drawing into digital text and generate insights.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Left Column: Raw Text */}
                        <div className="bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col">
                            <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="m-0 text-base font-semibold text-gray-800">Transcribed Text</h3>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 tracking-wider">OCR</span>
                            </div>
                            <div className="p-5 text-[15px] leading-relaxed text-gray-700 font-serif whitespace-pre-wrap text-base">
                                {digitalText ? (
                                    <p className="m-0">{digitalText}</p>
                                ) : (
                                    <p className="text-gray-400 italic m-0">No text detected.</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column: AI Context */}
                        <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(99,102,241,0.08)] border border-indigo-100 overflow-hidden flex flex-col">
                            <div className="px-5 py-4 bg-indigo-50/50 border-b border-indigo-100 flex justify-between items-center">
                                <h3 className="m-0 text-base font-semibold text-indigo-700">AI Analysis & Context</h3>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-white tracking-wider">AI</span>
                            </div>
                            <div className="p-5 text-[15px] leading-relaxed text-gray-700">
                                {aiInsights ? (
                                    <div
                                        className="[&>h3]:mt-0 [&>h3]:mb-2 [&>h3]:text-gray-900 [&>h3]:text-lg [&>ul]:pl-5 [&>ul]:mt-0 [&>ul>li]:mb-1.5"
                                        dangerouslySetInnerHTML={{ __html: aiInsights }}
                                    />
                                ) : (
                                    <p className="text-gray-400 italic m-0">No insights generated.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
