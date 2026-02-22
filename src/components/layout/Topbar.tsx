import { COLORS, PEN_SIZES } from "../../data/canvas/types";

interface Props {
    activeNoteTitle: string;
    tool: "pen" | "eraser" | "highlighter";
    setTool: (t: "pen" | "eraser" | "highlighter") => void;
    penColor: string;
    setPenColor: (c: string) => void;
    penSize: number;
    setPenSize: (s: number) => void;
    viewMode: "canvas" | "insights";
    setViewMode: (mode: "canvas" | "insights") => void;
    onRunAI: () => void;
    isProcessingAI: boolean;
    zoom: number;
    setZoom: (z: number) => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    pageStyle: "ruled" | "dotted" | "blank";
    onPageStyleChange: (style: "ruled" | "dotted" | "blank") => void;
}

export default function Topbar({
    activeNoteTitle,
    tool,
    setTool,
    penColor,
    setPenColor,
    penSize,
    setPenSize,
    viewMode,
    setViewMode,
    onRunAI,
    isProcessingAI,
    zoom,
    setZoom,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    pageStyle,
    onPageStyleChange
}: Props) {
    return (
        <div className="flex flex-col bg-white border-b border-gray-100 shrink-0 z-20 sticky top-0">
            {/* Top Row: Title */}
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-center">
                <h1 className="text-base font-bold text-gray-900 truncate m-0">
                    {activeNoteTitle}
                </h1>
            </div>

            {/* Bottom Row: Controls */}
            <div className="h-14 flex items-center px-4 gap-4">
                {/* Left Box: View Modes */}
                <div className="flex flex-none items-center justify-start min-w-0">
                    <div className="flex bg-gray-100/80 p-1 rounded-lg gap-1 border border-gray-200/50">
                        <button
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${viewMode === 'canvas' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                            onClick={() => setViewMode('canvas')}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Draw
                        </button>
                        <button
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${viewMode === 'insights' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                            onClick={() => setViewMode('insights')}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            AI Insights
                        </button>
                    </div>
                </div>

                {/* Center Box: Drawing Tools (or AI Button) */}
                <div className="flex-[3] flex justify-center shrink-0 w-full">
                    {viewMode === 'canvas' ? (
                        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 shadow-sm w-max mx-auto">
                            {/* Tools */}
                            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                                <button
                                    className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer transition-colors ${tool === "pen" ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                                    onClick={() => setTool("pen")}
                                    title="Pen Tool"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button
                                    className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer transition-colors ${tool === "highlighter" ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                                    onClick={() => setTool("highlighter")}
                                    title="Highlighter Tool"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2l4 4-2 2-4-4 2-2z" />
                                        <path d="M14 8l-6 6" />
                                        <path d="M8 14H6.5c-1 0-1.5.5-1.5 1.5V17L3 19l2 2 2-2v-2c1 0 1.5-.5 1.5-1.5V14" />
                                        <path d="M16 6l4 4" />
                                    </svg>
                                </button>
                                <button
                                    className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer transition-colors ${tool === "eraser" ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                                    onClick={() => setTool("eraser")}
                                    title="Eraser Tool"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                                        <path d="M22 21H7" />
                                        <path d="m5 11 9 9" />
                                    </svg>
                                </button>
                            </div>

                            <div className="w-px h-6 bg-gray-200 mx-1" />

                            {/* Colors */}
                            <div className="flex items-center gap-1.5 px-1">
                                {COLORS.map((c) => (
                                    <button
                                        key={c}
                                        className={`w-6 h-6 rounded-full border border-black/10 p-0 cursor-pointer hover:scale-110 transition-transform ${penColor === c ? "ring-2 ring-indigo-500 ring-offset-1" : ""}`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => {
                                            setPenColor(c);
                                            setTool("pen");
                                        }}
                                        title={c}
                                    />
                                ))}
                            </div>

                            <div className="w-px h-6 bg-gray-200 mx-1" />

                            {/* Sizes */}
                            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                                {PEN_SIZES.map((s) => (
                                    <button
                                        key={s}
                                        className={`w-8 h-8 rounded-md bg-transparent flex items-center justify-center cursor-pointer transition-colors ${penSize === s ? "bg-indigo-50" : "hover:bg-gray-50"}`}
                                        onClick={() => setPenSize(s)}
                                        title={`Size ${s}`}
                                    >
                                        <div
                                            className="rounded-full"
                                            style={{
                                                width: `${s}px`,
                                                height: `${s}px`,
                                                backgroundColor: tool === "eraser" ? "#000" : penColor,
                                                opacity: tool === "highlighter" ? 0.4 : (penSize === s ? 1 : 0.6)
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <button
                            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none px-6 py-2.5 rounded-xl font-semibold text-sm cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                            onClick={onRunAI}
                            disabled={isProcessingAI}
                        >
                            {isProcessingAI ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Extract Insights
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Right Box: Aux Controls */}
                <div className="flex flex-none items-center justify-end gap-3 min-w-0">
                    {viewMode === 'canvas' && (
                        <>
                            {/* Page Style Dropdown */}
                            <div className="relative hidden lg:block">
                                <select
                                    className="appearance-none bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer shadow-sm hover:bg-gray-100"
                                    value={pageStyle}
                                    onChange={(e) => onPageStyleChange(e.target.value as any)}
                                    title="Page Style"
                                >
                                    <option value="ruled">Ruled</option>
                                    <option value="dotted">Dotted</option>
                                    <option value="blank">Blank</option>


                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div className="w-px h-5 bg-gray-200 hidden md:block" />

                            {/* Zoom Controls */}
                            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5 shadow-sm">
                                <button
                                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 bg-transparent rounded cursor-pointer hover:bg-gray-200 transition-colors"
                                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                                    title="Zoom Out"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                <button
                                    className="w-10 text-[11px] font-bold text-gray-600 bg-transparent text-center cursor-pointer hover:text-gray-900"
                                    onClick={() => setZoom(1)}
                                    title="Reset Zoom"
                                >
                                    {Math.round(zoom * 100)}%
                                </button>
                                <button
                                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 bg-transparent rounded cursor-pointer hover:bg-gray-200 transition-colors"
                                    onClick={() => setZoom(Math.min(3.0, zoom + 0.1))}
                                    title="Zoom In"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>

                            <div className="w-px h-5 bg-gray-200 hidden sm:block" />

                            {/* Undo / Redo */}
                            <div className="hidden sm:flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-200 shadow-sm">
                                <button
                                    className="w-7 h-7 flex items-center justify-center bg-transparent rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    onClick={onUndo}
                                    disabled={!canUndo}
                                    title="Undo"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                </button>
                                <button
                                    className="w-7 h-7 flex items-center justify-center bg-transparent rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    onClick={onRedo}
                                    disabled={!canRedo}
                                    title="Redo"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
