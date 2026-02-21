import { COLORS, PEN_SIZES } from "../../data/canvas/types";

interface Props {
    activeNoteTitle: string;
    tool: "pen" | "eraser";
    setTool: (t: "pen" | "eraser") => void;
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
    canRedo
}: Props) {
    return (
        <div className="h-[90px] bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
            <div className="flex items-center gap-3 min-w-[120px]">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg gap-0.5">
                    <button
                        className={`px-3 py-1.5 bg-transparent border-none rounded-md text-[13px] font-medium cursor-pointer transition-all duration-200 ${viewMode === 'canvas' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setViewMode('canvas')}
                    >
                        ✏️ Draw
                    </button>
                    <button
                        className={`px-3 py-1.5 bg-transparent border-none rounded-md text-[13px] font-medium cursor-pointer transition-all duration-200 ${viewMode === 'insights' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setViewMode('insights')}
                    >
                        🤖 AI Insights
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-[15px] font-semibold text-gray-900 m-0 mb-2 text-center">{activeNoteTitle}</h1>

                {viewMode === 'canvas' ? (
                    <div className="flex items-center gap-4 bg-gray-100 px-3 py-1 rounded-lg">
                        <div className="flex items-center gap-2">
                            <button
                                className={`px-3 py-1.5 bg-transparent border-none rounded-md text-[13px] font-medium cursor-pointer transition-all duration-150 flex items-center gap-1.5 ${tool === "pen" ? "bg-white text-blue-500 shadow-sm" : "text-gray-600 hover:bg-gray-200"}`}
                                onClick={() => setTool("pen")}
                                title="Pen Tool"
                            >
                                ✏️ Pen
                            </button>
                            <button
                                className={`px-3 py-1.5 bg-transparent border-none rounded-md text-[13px] font-medium cursor-pointer transition-all duration-150 flex items-center gap-1.5 ${tool === "eraser" ? "bg-white text-blue-500 shadow-sm" : "text-gray-600 hover:bg-gray-200"}`}
                                onClick={() => setTool("eraser")}
                                title="Eraser Tool"
                            >
                                🧹 Eraser
                            </button>
                        </div>

                        <div className="w-px h-6 bg-gray-300" />

                        <div className="flex items-center gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    className={`w-5 h-5 rounded-full border border-black/10 p-0 cursor-pointer hover:scale-110 transition-transform ${penColor === c ? "outline outline-2 outline-blue-500 outline-offset-2" : ""}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => {
                                        setPenColor(c);
                                        setTool("pen");
                                    }}
                                    title={c}
                                />
                            ))}
                        </div>

                        <div className="w-px h-6 bg-gray-300" />

                        <div className="flex items-center gap-2">
                            {PEN_SIZES.map((s) => (
                                <button
                                    key={s}
                                    className={`w-7 h-7 rounded bg-transparent border-none flex items-center justify-center cursor-pointer hover:bg-gray-200 ${penSize === s ? "bg-white shadow-sm" : ""}`}
                                    onClick={() => setPenSize(s)}
                                    title={`Size ${s}`}
                                >
                                    <div
                                        className="rounded-full"
                                        style={{
                                            width: `${s}px`,
                                            height: `${s}px`,
                                            backgroundColor: tool === "eraser" ? "#000" : penColor,
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 bg-gray-100 px-3 py-1 rounded-lg">
                        <button
                            className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-none px-4 py-2 rounded-md font-semibold text-sm cursor-pointer shadow-sm shadow-indigo-500/20 transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={onRunAI}
                            disabled={isProcessingAI}
                        >
                            {isProcessingAI ? "✨ Thinking..." : "✨ Extract Handwriting"}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 justify-end min-w-[120px]">
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5 mr-2">
                    <button className="w-7 h-7 !p-0 font-bold text-base flex items-center justify-center bg-transparent border-none rounded-md text-gray-600 cursor-pointer hover:bg-gray-200" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} title="Zoom Out">-</button>
                    <button className="min-w-[48px] text-center text-xs font-semibold text-gray-700 bg-transparent border-none cursor-pointer hover:text-gray-900" onClick={() => setZoom(1)} title="Reset Zoom">
                        {Math.round(zoom * 100)}%
                    </button>
                    <button className="w-7 h-7 !p-0 font-bold text-base flex items-center justify-center bg-transparent border-none rounded-md text-gray-600 cursor-pointer hover:bg-gray-200" onClick={() => setZoom(Math.min(3.0, zoom + 0.1))} title="Zoom In">+</button>
                </div>
                <div className="w-px h-6 bg-gray-300" />
                <button className="w-8 h-8 rounded-md bg-transparent border-none text-base text-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" onClick={onUndo} disabled={!canUndo} title="Undo (Cmd+Z)">↩</button>
                <button className="w-8 h-8 rounded-md bg-transparent border-none text-base text-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" onClick={onRedo} disabled={!canRedo} title="Redo (Cmd+Shift+Z)">↪</button>
                <button className="w-8 h-8 rounded-full bg-rose-600 text-white border-none font-bold text-sm flex items-center justify-center cursor-pointer ml-1">K</button>
            </div>
        </div>
    );
}
