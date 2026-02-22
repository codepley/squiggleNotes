import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import type { Stroke, Point } from "../../data/canvas/types";
import { getPointFromEvent } from "./utils";

interface Props {
    tool: "pen" | "eraser" | "highlighter";
    penColor: string;
    penSize: number;
    initialStrokes?: Stroke[];
    initialPageCount?: number;
    onSave?: (strokes: Stroke[], pageCount: number) => void;
    zoom?: number;
    pageStyle?: "ruled" | "dotted" | "blank";
    onHistoryStateChange?: (canUndo: boolean, canRedo: boolean) => void;
}

export interface DocumentCanvasHandle {
    undo: () => void;
    redo: () => void;
}

const PAGE_HEIGHT = 1056; // Standard 8.5x11 aspect ratio width: 816, height: 1056

const DocumentCanvas = forwardRef<DocumentCanvasHandle, Props>(({
    tool,
    penColor,
    penSize,
    initialStrokes = [],
    initialPageCount = 1,
    onSave,
    zoom = 1,
    pageStyle = "ruled",
    onHistoryStateChange
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Application State
    const [strokes, setStrokes] = useState<Stroke[]>(initialStrokes);
    const [redoStack, setRedoStack] = useState<Stroke[]>([]);
    const [pageCount, setPageCount] = useState(initialPageCount);

    // Interaction Refs
    const isDrawing = useRef(false);
    const currentStroke = useRef<Point[]>([]);

    // Redraw the entire canvas
    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear transparent
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw all strokes
        strokes.forEach((s) => {
            ctx.beginPath();
            if (s.tool === "eraser") {
                ctx.globalCompositeOperation = "destination-out";
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.lineWidth = s.size * 4;
            } else if (s.tool === "highlighter") {
                ctx.globalCompositeOperation = "multiply"; // Best blending for highlighters
                // Convert hex to rgba to add transparency
                const hex = s.color.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
                ctx.lineWidth = s.size * 3; // Highlighter is wider
            } else {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = s.color;
                ctx.lineWidth = s.size;
            }

            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            s.points.forEach((pt, i) => {
                if (i === 0) {
                    ctx.moveTo(pt.x, pt.y);
                } else {
                    ctx.lineTo(pt.x, pt.y);
                }
            });
            ctx.stroke();
        });

        // Reset composite operation
        ctx.globalCompositeOperation = "source-over";
    }, [strokes]);

    // Imperative Expose (Undo/Redo)
    useImperativeHandle(ref, () => ({
        undo: () => {
            setStrokes((prev) => {
                if (prev.length === 0) return prev;
                const newStrokes = [...prev];
                const lastStroke = newStrokes.pop();
                if (lastStroke) {
                    setRedoStack((r) => [...r, lastStroke]);
                }
                return newStrokes;
            });
        },
        redo: () => {
            setRedoStack((prev) => {
                if (prev.length === 0) return prev;
                const newRedo = [...prev];
                const nextStroke = newRedo.pop();
                if (nextStroke) {
                    setStrokes((s) => [...s, nextStroke]);
                }
                return newRedo;
            });
        }
    }));

    // Trigger History State Callback
    useEffect(() => {
        if (onHistoryStateChange) {
            onHistoryStateChange(strokes.length > 0, redoStack.length > 0);
        }
    }, [strokes.length, redoStack.length, onHistoryStateChange]);

    // Handle Resize and initial setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.scale(dpr, dpr);
        }

        redrawCanvas();
    }, [redrawCanvas, pageCount]); // Re-scale and redraw if canvasHeight changes

    // Trigger Save callback whenever strokes or pageCount changes
    useEffect(() => {
        if (onSave) {
            onSave(strokes, pageCount);
        }
    }, [strokes, pageCount, onSave]);

    // Pointer Events for Drawing
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (e.button === 1 || e.button === 2) return; // Ignore Middle or Right click

        // Left click -> Draw mode
        isDrawing.current = true;
        const pt = getPointFromEvent(e, canvasRef.current!, zoom);
        currentStroke.current = [pt];

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y); // start path visually
        }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (!isDrawing.current) return;

        const pt = getPointFromEvent(e, canvasRef.current!, zoom);
        currentStroke.current.push(pt);

        // Check if we approach the bottom edge of the *LAST* page.
        const totalDocumentHeight = pageCount * PAGE_HEIGHT;
        if (pt.y > totalDocumentHeight - 200) {
            setPageCount((prev) => prev + 1);
        }

        // Provide immediate visual feedback for the stroke being drawn
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            if (tool === "eraser") {
                ctx.globalCompositeOperation = "destination-out";
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.lineWidth = penSize * 4;
            } else if (tool === "highlighter") {
                ctx.globalCompositeOperation = "multiply";
                const hex = penColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
                ctx.lineWidth = penSize * 3;
            } else {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = penColor;
                ctx.lineWidth = penSize;
            }
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            const pressure = e.pressure !== undefined ? e.pressure : 0.5;
            if (tool === "pen") {
                ctx.lineWidth = penSize * (0.6 + pressure * 0.8);
            } else if (tool === "highlighter") {
                ctx.lineWidth = (penSize * 3) * (0.8 + pressure * 0.4); // less pressure variance
            }

            const prevPt = currentStroke.current[currentStroke.current.length - 2];
            ctx.moveTo(prevPt.x, prevPt.y);
            ctx.lineTo(pt.x, pt.y);
            ctx.stroke();
        }
    };

    const handlePointerUp = () => {
        if (!isDrawing.current) return;
        isDrawing.current = false;

        if (currentStroke.current.length > 1) {
            // Capture the array synchronously before we clear the ref
            const finalPoints = [...currentStroke.current];
            const currentPenColor = penColor;
            const currentPenSize = penSize;
            const currentTool = tool;

            setStrokes((prev) => [
                ...prev,
                {
                    points: finalPoints,
                    color: currentPenColor,
                    size: currentPenSize,
                    tool: currentTool,
                }
            ]);

            // Drawing a new stroke clears the redos
            setRedoStack([]);
        }

        // Synchronously wipe the ref for the next line
        currentStroke.current = [];
    };

    // Generate an array of page IDs based on count
    const pages = Array.from({ length: pageCount }, (_, i) => i);

    return (
        <div className="w-full h-full bg-[#D1D1D6] overflow-y-auto overflow-x-hidden flex justify-center pt-10 pb-20">
            <div
                className="relative w-[816px] flex flex-col"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease-out'
                }}
            >

                {/* CSS Rendered Stack of Pages */}
                <div className="flex flex-col gap-4 w-full">
                    {pages.map((p) => {
                        let backgroundStyle = {};
                        if (pageStyle === "ruled") {
                            backgroundStyle = {
                                backgroundImage: `linear-gradient(to right, transparent 79px, #fca5a5 79px, #fca5a5 81px, transparent 81px), linear-gradient(#e5e7eb 1px, transparent 1px)`,
                                backgroundSize: '100% 100%, 100% 32px',
                                backgroundPosition: '0 0, 0 32px'
                            };
                        } else if (pageStyle === "dotted") {
                            backgroundStyle = {
                                backgroundImage: `radial-gradient(#c8c8c8 1px, transparent 1px)`,
                                backgroundSize: '24px 24px',
                                backgroundPosition: '0 0'
                            };
                        } else {
                            // blank
                            backgroundStyle = {};
                        }

                        return (
                            <div
                                key={p}
                                className="w-full h-[1056px] bg-white rounded shadow-sm relative overflow-hidden shrink-0"
                                style={backgroundStyle}
                            />
                        );
                    })}
                </div>

                {/* Absolute Canvas Overlaying the Pages */}
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full z-10 touch-none pointer-events-auto"
                    style={{
                        cursor: tool === "eraser" ? "cell" : (tool === "highlighter" ? "text" : "crosshair"),
                        height: `${pageCount * PAGE_HEIGHT}px`, // Canvas grows precisely with pages
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                />
            </div>
        </div>
    );
});

export default DocumentCanvas;
