import { useState, useRef, useCallback, useEffect } from "react";
import DocumentCanvas from "./components/canvas/DocumentCanvas";
import type { DocumentCanvasHandle } from "./components/canvas/DocumentCanvas";
import DigitalInsightsView from "./components/canvas/DigitalInsightsView";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import LandingView from "./components/layout/LandingView";
import PromptModal from "./components/ui/PromptModal";
import CalendarView from "./components/calendar/CalendarView";
import type { CalendarTask } from "./data/calendar/types";
import { mockFolders } from "./data/mock/sidebarData";
import type { Folder, Note } from "./data/mock/sidebarData";
import { COLORS, PEN_SIZES } from "./data/canvas/types";
import type { Stroke } from "./data/canvas/types";
import { extractBase64ImageFromStrokes, generateInsightsFromImage } from "./services/ai";

interface NoteState {
    strokes: Stroke[];
    pageCount: number;
    pageStyle?: "ruled" | "dotted" | "blank";
    digitalText?: string;
    aiInsights?: string;
}

function App() {
    // Toolbar state
    const [tool, setTool] = useState<"pen" | "eraser" | "highlighter">("pen");
    const [penColor, setPenColor] = useState(COLORS[0]);
    const [penSize, setPenSize] = useState(PEN_SIZES[1]);

    // Folders State
    const [folders, setFolders] = useState<Folder[]>(() => {
        try {
            const saved = localStorage.getItem("SQUIGGLE_FOLDERS");
            return saved ? JSON.parse(saved) : mockFolders;
        } catch {
            return mockFolders;
        }
    });

    useEffect(() => {
        localStorage.setItem("SQUIGGLE_FOLDERS", JSON.stringify(folders));
    }, [folders]);

    // Calendar Tasks State
    const [tasks, setTasks] = useState<CalendarTask[]>(() => {
        try {
            const saved = localStorage.getItem("SQUIGGLE_TASKS");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("SQUIGGLE_TASKS", JSON.stringify(tasks));
    }, [tasks]);

    // Sidebar state
    const [activeNoteId, setActiveNoteId] = useState<string | null>(() => {
        const saved = localStorage.getItem("SQUIGGLE_ACTIVE_NOTE");
        if (saved && saved !== 'null') return saved;
        return null;
    });

    useEffect(() => {
        localStorage.setItem("SQUIGGLE_ACTIVE_NOTE", activeNoteId || 'null');
    }, [activeNoteId]);

    // AI & View State
    const [viewMode, setViewMode] = useState<"canvas" | "insights">("canvas");
    const [isProcessingAI, setIsProcessingAI] = useState(false);

    // Zoom State
    const [zoom, setZoom] = useState(1);

    // History State
    const canvasRef = useRef<DocumentCanvasHandle>(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const activeNoteTitle = (() => {
        let title = "Untitled Note";
        const findTitle = (fs: Folder[]) => {
            for (const f of fs) {
                const note = f.notes.find(n => n.id === activeNoteId);
                if (note) {
                    title = note.title;
                    return true;
                }
                if (f.subfolders && findTitle(f.subfolders)) return true;
            }
            return false;
        };
        findTitle(folders);
        return title;
    })();

    // Force Render trigger for noteMemory changes that need immediate UI updates
    const [, forceRender] = useState({});

    // Modal state for all name prompts
    const [promptConfig, setPromptConfig] = useState<{
        isOpen: boolean;
        title: string;
        defaultValue?: string;
        onSubmit: (value: string) => void;
    }>({
        isOpen: false,
        title: "",
        onSubmit: () => { }
    });

    // Note Memory (Dictionary mapping NoteId -> NoteState)
    // We use a ref so saving strokes doesn't trigger a re-render of the whole App shell
    const noteMemory = useRef<Record<string, NoteState>>({});

    // Initialize note memory once safely
    useState(() => {
        try {
            const saved = localStorage.getItem("SQUIGGLE_NOTES");
            if (saved) noteMemory.current = JSON.parse(saved);
        } catch {
            // ignore parsing errors
        }
    });

    const saveNoteMemory = () => {
        localStorage.setItem("SQUIGGLE_NOTES", JSON.stringify(noteMemory.current));
    };

    const handleSaveNote = useCallback((strokes: Stroke[], pageCount: number, pageStyle?: "ruled" | "dotted" | "blank") => {
        if (!activeNoteId) return;
        const currentState = noteMemory.current[activeNoteId];
        const hasStyleChanged = pageStyle !== undefined && pageStyle !== currentState?.pageStyle;

        noteMemory.current[activeNoteId] = {
            ...(currentState || {}),
            strokes,
            pageCount,
            ...(pageStyle && { pageStyle })
        };
        saveNoteMemory();

        if (hasStyleChanged) {
            forceRender({});
        }
    }, [activeNoteId]);

    const handleCreateFolder = useCallback((parentId: string | null) => {
        setPromptConfig({
            isOpen: true,
            title: "Enter folder name:",
            defaultValue: "New Folder",
            onSubmit: (folderName) => {
                const newNoteId = `n-${Date.now()}`;
                const newNote: Note = {
                    id: newNoteId,
                    title: "Untitled Note",
                    updatedAt: "Just now"
                };

                const newFolder: Folder = {
                    id: `f-${Date.now()}`,
                    name: folderName,
                    notes: [newNote],
                    subfolders: []
                };

                if (parentId === null) {
                    setFolders(prev => [...prev, newFolder]);
                    setActiveNoteId(newNote.id);
                    return;
                }

                setFolders(prev => {
                    const insertInto = (fs: Folder[]): Folder[] => {
                        return fs.map(f => {
                            if (f.id === parentId) {
                                return { ...f, subfolders: [...(f.subfolders || []), newFolder] };
                            }
                            if (f.subfolders) {
                                return { ...f, subfolders: insertInto(f.subfolders) };
                            }
                            return f;
                        });
                    };
                    return insertInto(prev);
                });

                setActiveNoteId(newNote.id);
            }
        });
    }, []);

    const handleCreateNote = useCallback((folderId: string) => {
        setPromptConfig({
            isOpen: true,
            title: "Enter note name:",
            defaultValue: "Untitled Note",
            onSubmit: (noteName) => {
                const newNote: Note = {
                    id: `n-${Date.now()}`,
                    title: noteName,
                    updatedAt: "Just now"
                };

                setFolders(prev => {
                    const insertInto = (fs: Folder[]): Folder[] => {
                        return fs.map(f => {
                            if (f.id === folderId) {
                                return { ...f, notes: [...f.notes, newNote] };
                            }
                            if (f.subfolders) {
                                return { ...f, subfolders: insertInto(f.subfolders) };
                            }
                            return f;
                        });
                    };
                    return insertInto(prev);
                });

                setActiveNoteId(newNote.id);
            }
        });
    }, []);

    const handleRenameFolder = useCallback((folderId: string, currentName: string) => {
        setPromptConfig({
            isOpen: true,
            title: "Enter new folder name:",
            defaultValue: currentName,
            onSubmit: (newName) => {
                if (newName === currentName) return;
                setFolders(prev => {
                    const renameIn = (fs: Folder[]): Folder[] => {
                        return fs.map(f => {
                            if (f.id === folderId) {
                                return { ...f, name: newName };
                            }
                            if (f.subfolders) {
                                return { ...f, subfolders: renameIn(f.subfolders) };
                            }
                            return f;
                        });
                    };
                    return renameIn(prev);
                });
            }
        });
    }, []);

    const handleDeleteFolder = useCallback((folderId: string) => {
        setFolders(prev => {
            const filterOut = (fs: Folder[]): Folder[] => {
                // Filter out the folder from this level
                const filtered = fs.filter(f => f.id !== folderId);
                // Recursively filter its subfolders
                return filtered.map(f => {
                    if (f.subfolders) {
                        return { ...f, subfolders: filterOut(f.subfolders) };
                    }
                    return f;
                });
            };
            return filterOut(prev);
        });
    }, []);

    const handleRenameNote = useCallback((noteId: string, currentName: string) => {
        setPromptConfig({
            isOpen: true,
            title: "Enter new note name:",
            defaultValue: currentName,
            onSubmit: (newName) => {
                if (newName === currentName) return;
                setFolders(prev => {
                    const renameIn = (fs: Folder[]): Folder[] => {
                        return fs.map(f => {
                            const hasNote = f.notes.some(n => n.id === noteId);
                            if (hasNote) {
                                return {
                                    ...f,
                                    notes: f.notes.map(n => n.id === noteId ? { ...n, title: newName } : n)
                                };
                            }
                            if (f.subfolders) {
                                return { ...f, subfolders: renameIn(f.subfolders) };
                            }
                            return f;
                        });
                    };
                    return renameIn(prev);
                });
            }
        });
    }, []);

    // Live AI API Call
    const handleRunAI = useCallback(async () => {
        if (!activeNoteId) return;
        setIsProcessingAI(true);

        // Ensure state exists before mutating
        if (!noteMemory.current[activeNoteId]) {
            noteMemory.current[activeNoteId] = { strokes: [], pageCount: 1, pageStyle: "ruled" };
        }

        const strokes = noteMemory.current[activeNoteId].strokes || [];
        const base64Image = extractBase64ImageFromStrokes(strokes);

        if (!base64Image) {
            noteMemory.current[activeNoteId] = {
                ...noteMemory.current[activeNoteId],
                digitalText: "No handwriting detected.",
                aiInsights: "<p>Please draw something on the canvas first.</p>"
            };
        } else {
            const result = await generateInsightsFromImage(base64Image);

            if (!result) {
                noteMemory.current[activeNoteId] = {
                    ...noteMemory.current[activeNoteId],
                    digitalText: "API Error...",
                    aiInsights: "<p style='color: #ef4444;'>Failed to generate insights. Please ensure you have added a valid <code>VITE_GEMINI_API_KEY</code> to your <code>.env.local</code> file and restarted the development server.</p>"
                };
            } else {
                noteMemory.current[activeNoteId] = {
                    ...noteMemory.current[activeNoteId],
                    digitalText: result.digitalText,
                    aiInsights: result.aiInsights
                };
            }
        }

        saveNoteMemory();
        setIsProcessingAI(false);
        setViewMode("insights"); // Auto-switch to digital tab to show results
    }, [activeNoteId]);

    // Lookup current state for the active note
    const currentState = activeNoteId ? noteMemory.current[activeNoteId] : undefined;

    // History Hooks
    const handleHistoryStateChange = useCallback((undoAvailable: boolean, redoAvailable: boolean) => {
        setCanUndo(undoAvailable);
        setCanRedo(redoAvailable);
    }, []);

    const handleUndo = useCallback(() => canvasRef.current?.undo(), []);
    const handleRedo = useCallback(() => canvasRef.current?.redo(), []);

    const handleGoHome = useCallback(() => {
        setActiveNoteId(null);
    }, []);

    return (
        <div className="w-screen h-screen flex bg-gray-100">
            {!activeNoteId ? (
                <LandingView
                    folders={folders}
                    onSelectNote={setActiveNoteId}
                    onCreateFolder={handleCreateFolder}
                />
            ) : activeNoteId === 'calendar' ? (
                <>
                    <Sidebar
                        folders={folders}
                        activeNoteId={activeNoteId}
                        tasks={tasks}
                        onSelectNote={setActiveNoteId}
                        onCreateFolder={handleCreateFolder}
                        onCreateNote={handleCreateNote}
                        onRenameFolder={handleRenameFolder}
                        onDeleteFolder={handleDeleteFolder}
                        onRenameNote={handleRenameNote}
                        onGoHome={handleGoHome}
                    />
                    <div className="flex-1 min-w-0">
                        <CalendarView tasks={tasks} onTasksChange={setTasks} />
                    </div>
                </>
            ) : (
                <>
                    <Sidebar
                        folders={folders}
                        activeNoteId={activeNoteId}
                        tasks={tasks}
                        onSelectNote={setActiveNoteId}
                        onCreateFolder={handleCreateFolder}
                        onCreateNote={handleCreateNote}
                        onRenameFolder={handleRenameFolder}
                        onDeleteFolder={handleDeleteFolder}
                        onRenameNote={handleRenameNote}
                        onGoHome={handleGoHome}
                    />

                    <div className="flex-1 flex flex-col h-screen min-w-0">
                        <Topbar
                            activeNoteTitle={activeNoteTitle}
                            tool={tool}
                            setTool={setTool}
                            penColor={penColor}
                            setPenColor={setPenColor}
                            penSize={penSize}
                            setPenSize={setPenSize}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            onRunAI={handleRunAI}
                            isProcessingAI={isProcessingAI}
                            zoom={zoom}
                            setZoom={setZoom}
                            onUndo={handleUndo}
                            onRedo={handleRedo}
                            canUndo={canUndo}
                            canRedo={canRedo}
                            pageStyle={currentState?.pageStyle || "ruled"}
                            onPageStyleChange={(style) => {
                                handleSaveNote(currentState?.strokes || [], currentState?.pageCount || 1, style);
                            }}
                        />

                        {/* The canvas occupies the remaining height below the Topbar */}
                        <div className="flex-1 relative overflow-hidden">
                            {viewMode === 'canvas' ? (
                                <DocumentCanvas
                                    ref={canvasRef}
                                    key={activeNoteId} // <--- CRITICAL: Forces full unmount/mount on note switch
                                    tool={tool}
                                    penColor={penColor}
                                    penSize={penSize}
                                    initialStrokes={currentState?.strokes || []}
                                    initialPageCount={currentState?.pageCount || 1}
                                    pageStyle={currentState?.pageStyle || "ruled"}
                                    onSave={(strokes, pageCount) => handleSaveNote(strokes, pageCount, currentState?.pageStyle || "ruled")}
                                    zoom={zoom}
                                    onHistoryStateChange={handleHistoryStateChange}
                                />
                            ) : (
                                <DigitalInsightsView
                                    noteId={activeNoteId}
                                    digitalText={currentState?.digitalText}
                                    aiInsights={currentState?.aiInsights}
                                    isProcessing={isProcessingAI}
                                    zoom={zoom}
                                />
                            )}
                        </div>
                    </div>
                </>
            )}
            <PromptModal
                {...promptConfig}
                onClose={() => setPromptConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}

export default App;
