import { useState } from "react";
import type { Folder } from "../../data/mock/sidebarData";

interface Props {
    folders: Folder[];
    activeNoteId: string | null;
    onSelectNote: (id: string) => void;
    onCreateFolder: (parentId: string | null) => void;
    onCreateNote: (folderId: string) => void;
    onRenameFolder: (folderId: string, newName: string) => void;
    onDeleteFolder: (folderId: string) => void;
    onRenameNote: (noteId: string, newName: string) => void;
    onGoHome: () => void;
}

interface FolderNodeProps {
    folder: Folder;
    activeNoteId: string | null;
    onSelectNote: (id: string) => void;
    onCreateFolder: (parentId: string | null) => void;
    onCreateNote: (folderId: string) => void;
    onRenameFolder: (folderId: string, newName: string) => void;
    onDeleteFolder: (folderId: string) => void;
    onRenameNote: (noteId: string, newName: string) => void;
    expandedSet: Set<string>;
    toggleFolder: (id: string) => void;
    depth?: number;
}

function FolderNode({
    folder,
    activeNoteId,
    onSelectNote,
    onCreateFolder,
    onCreateNote,
    onRenameFolder,
    onDeleteFolder,
    onRenameNote,
    expandedSet,
    toggleFolder,
    depth = 0
}: FolderNodeProps) {
    const isExpanded = expandedSet.has(folder.id);
    const indentStyles = { paddingLeft: `${depth * 16}px` };

    return (
        <div className="flex flex-col mb-1 group">
            <div className="flex items-center justify-between w-full mb-1" style={indentStyles}>
                <button
                    className="flex-1 flex items-center px-2 py-1.5 bg-transparent border-none cursor-pointer rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                    onClick={() => toggleFolder(folder.id)}
                >
                    <span className={`text-base mr-2 transition-transform duration-200 opacity-60 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>›</span>
                    <span className="mr-2 text-sm">📁</span>
                    <span className="font-semibold text-sm">{folder.name}</span>
                </button>
                <div className="flex gap-1 opacity-0 transition-opacity duration-200 pr-2 group-hover:opacity-100">
                    <button className="bg-transparent border-none cursor-pointer px-1 py-0.5 rounded text-gray-500 text-xs hover:bg-gray-300 hover:text-gray-900" onClick={() => {
                        const newName = prompt("Enter new folder name:", folder.name);
                        if (newName && newName !== folder.name) onRenameFolder(folder.id, newName);
                    }} title="Rename Folder">✏️</button>
                    <button className="bg-transparent border-none cursor-pointer px-1 py-0.5 rounded text-gray-500 text-xs hover:bg-gray-300 hover:text-gray-900" onClick={() => {
                        if (confirm(`Delete folder "${folder.name}" and all contents?`)) {
                            onDeleteFolder(folder.id);
                        }
                    }} title="Delete Folder">🗑️</button>
                    <button className="bg-transparent border-none cursor-pointer px-1 py-0.5 rounded text-gray-500 text-xs hover:bg-gray-300 hover:text-gray-900" onClick={() => onCreateNote(folder.id)} title="New Note">📝</button>
                    <button className="bg-transparent border-none cursor-pointer px-1 py-0.5 rounded text-gray-500 text-xs hover:bg-gray-300 hover:text-gray-900" onClick={() => onCreateFolder(folder.id)} title="New Subfolder">📁+</button>
                </div>
            </div>

            {isExpanded && (
                <div className="flex flex-col gap-0.5 mb-2 ml-4 border-l border-gray-200 pl-2">
                    {/* Render Notes First */}
                    {folder.notes.map(note => (
                        <div key={note.id} className="group/note flex items-center relative w-full mb-0.5">
                            <button
                                className={`flex-1 text-left px-3 py-2 bg-transparent border-none rounded-md cursor-pointer transition-colors duration-100 pr-8 ${activeNoteId === note.id
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'hover:bg-gray-200 text-gray-700'
                                    }`}
                                onClick={() => onSelectNote(note.id)}
                            >
                                <div className={`text-sm font-medium mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis ${activeNoteId === note.id ? 'text-inherit' : 'text-gray-700'}`}>
                                    {note.title}
                                </div>
                                <div className="text-xs text-gray-500">{note.updatedAt}</div>
                            </button>
                            <div className="absolute right-2 opacity-0 group-hover/note:opacity-100 transition-opacity flex items-center">
                                <button
                                    className="bg-transparent border-none cursor-pointer p-1 rounded text-gray-400 hover:bg-white hover:text-gray-900 shadow-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newName = prompt("Enter new note name:", note.title);
                                        if (newName && newName !== note.title) {
                                            onRenameNote(note.id, newName);
                                        }
                                    }}
                                    title="Rename Note"
                                >
                                    ✏️
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Render Subfolders Recursively */}
                    {folder.subfolders?.map(subfolder => (
                        <FolderNode
                            key={subfolder.id}
                            folder={subfolder}
                            activeNoteId={activeNoteId}
                            onSelectNote={onSelectNote}
                            onCreateFolder={onCreateFolder}
                            onCreateNote={onCreateNote}
                            onRenameFolder={onRenameFolder}
                            onDeleteFolder={onDeleteFolder}
                            onRenameNote={onRenameNote}
                            expandedSet={expandedSet}
                            toggleFolder={toggleFolder}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Sidebar({
    folders,
    activeNoteId,
    onSelectNote,
    onCreateFolder,
    onCreateNote,
    onRenameFolder,
    onDeleteFolder,
    onRenameNote,
    onGoHome
}: Props) {
    const [searchQuery, setSearchQuery] = useState("");

    // Generate an initial set containing ALL folder IDs (including nested) so they are open by default
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
        const allIds = new Set<string>();
        const traverse = (fs: Folder[]) => {
            fs.forEach(f => {
                allIds.add(f.id);
                if (f.subfolders) traverse(f.subfolders);
            });
        };
        traverse(folders);
        return allIds;
    });

    const toggleFolder = (folderId: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(folderId)) {
                next.delete(folderId);
            } else {
                next.add(folderId);
            }
            return next;
        });
    };

    const normalize = (text: string) => text.toLowerCase();

    const filteredFolders = (() => {
        if (!searchQuery.trim()) return folders;
        const query = normalize(searchQuery);

        const filterTree = (fs: Folder[]): Folder[] | null => {
            const result: Folder[] = [];
            for (const f of fs) {
                // Check if this folder itself matches
                const folderMatches = normalize(f.name).includes(query);

                // Filter its notes
                const matchingNotes = f.notes.filter(n => normalize(n.title).includes(query));

                // Recursively filter subfolders
                const matchingSubfolders = f.subfolders ? filterTree(f.subfolders) : [];

                if (folderMatches || matchingNotes.length > 0 || (matchingSubfolders && matchingSubfolders.length > 0)) {
                    result.push({
                        ...f,
                        notes: matchingNotes.length > 0 ? matchingNotes : f.notes, // Keep matching notes, or all if folder matches
                        subfolders: matchingSubfolders || []
                    });
                }
            }
            return result.length > 0 ? result : null;
        };

        return filterTree(folders) || [];
    })();

    return (
        <div className="w-[260px] bg-gray-50 border-r border-gray-200 flex flex-col h-screen shrink-0 select-none">
            <div className="p-4 border-b border-gray-200">
                <div
                    className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={onGoHome}
                    title="Go to Home"
                >
                    <div className="w-7 h-7 bg-blue-500 text-white rounded-md flex items-center justify-center font-bold text-base">S</div>
                    <h2 className="text-base font-semibold text-gray-900 m-0">SquiggleNotes</h2>
                </div>

                <button
                    className={`w-full text-left px-3 py-2 mb-4 flex items-center gap-2 rounded-md font-medium transition-colors ${activeNoteId === null
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                        }`}
                    onClick={onGoHome}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home Overview
                </button>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search notes & folders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md text-sm outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900"
                    />
                </div>
                <button
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium cursor-pointer transition-all duration-150 shadow-sm hover:bg-gray-50 hover:border-gray-400"
                    onClick={() => onCreateFolder(null)}
                >
                    + New Folder
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-3">
                {filteredFolders.map(folder => (
                    <FolderNode
                        key={folder.id}
                        folder={folder}
                        activeNoteId={activeNoteId}
                        onSelectNote={onSelectNote}
                        onCreateFolder={onCreateFolder}
                        onCreateNote={onCreateNote}
                        onRenameFolder={onRenameFolder}
                        onDeleteFolder={onDeleteFolder}
                        onRenameNote={onRenameNote}
                        expandedSet={expandedFolders}
                        toggleFolder={toggleFolder}
                    />
                ))}
            </div>
        </div>
    );
}
