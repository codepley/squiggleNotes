import { useState, useMemo } from "react";
import type { Folder, Note } from "../../data/mock/sidebarData";

interface Props {
    folders: Folder[];
    onSelectNote: (noteId: string) => void;
    onCreateFolder: (parentId: string | null) => void;
}

export default function LandingView({ folders, onSelectNote, onCreateFolder }: Props) {
    const [searchQuery, setSearchQuery] = useState("");

    // Flatten all notes from all folders for the grid
    const allNotes = useMemo(() => {
        const notesList: { note: Note; folderName: string; folderId: string }[] = [];

        const extractNotes = (fs: Folder[], parentFolderName = "") => {
            fs.forEach(f => {
                const currentFolderName = parentFolderName ? `${parentFolderName} / ${f.name}` : f.name;
                f.notes.forEach(n => {
                    notesList.push({ note: n, folderName: currentFolderName, folderId: f.id });
                });
                if (f.subfolders) {
                    extractNotes(f.subfolders, currentFolderName);
                }
            });
        };

        extractNotes(folders);

        // Sort by newest first (mock implementation using ID as proxy for time)
        return notesList.sort((a, b) => b.note.id.localeCompare(a.note.id));
    }, [folders]);

    // Filter notes based on search query
    const filteredNotes = useMemo(() => {
        if (!searchQuery.trim()) return allNotes;

        const query = searchQuery.toLowerCase();
        return allNotes.filter(item =>
            item.note.title.toLowerCase().includes(query) ||
            item.folderName.toLowerCase().includes(query)
        );
    }, [allNotes, searchQuery]);

    // Create a new folder
    const handleCreateNewClick = () => {
        onCreateFolder(null);
    };

    return (
        <div className="w-full h-full bg-white overflow-y-auto flex flex-col items-center pt-20 pb-10 px-8">

            {/* Hero Section */}
            <div className="flex flex-col items-center mb-16 text-center max-w-2xl">
                <div className="w-20 h-20 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-6 shadow-indigo-200">
                    S
                </div>
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                    squiggleNotes
                </h1>
                <p className="text-lg text-gray-500 mb-8 max-w-lg">
                    Your digital notebook for limitless creativity. Draw, write, and extract insights with AI.
                </p>

                <button
                    onClick={handleCreateNewClick}
                    className="flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold text-lg transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Create New Folder
                </button>
            </div>

            {/* Search Section */}
            <div className="w-full max-w-5xl mb-10">
                <div className="relative max-w-md mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search all notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Recent Notes Grid */}
            <div className="w-full max-w-5xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {searchQuery ? "Search Results" : "Recent Notes"}
                    </h2>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                    </span>
                </div>

                {filteredNotes.length === 0 ? (
                    <div className="w-full py-16 flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-700">No notes found</p>
                        <p className="text-sm mt-1">Try adjusting your search query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredNotes.map((item) => (
                            <div
                                key={item.note.id}
                                onClick={() => onSelectNote(item.note.id)}
                                className="group bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between h-48 relative overflow-hidden"
                            >
                                {/* Decorative top border on hover */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate group-hover:text-indigo-600 transition-colors">
                                        {item.note.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                        {item.folderName}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                        {item.note.updatedAt}
                                    </span>
                                    <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1 group-hover:translate-x-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
