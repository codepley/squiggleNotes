import React, { useState, useEffect, useRef } from 'react';

interface Props {
    isOpen: boolean;
    title: string;
    defaultValue?: string;
    onClose: () => void;
    onSubmit: (value: string) => void;
}

export default function PromptModal({ isOpen, title, defaultValue = "", onClose, onSubmit }: Props) {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset value when modal opens and focus input
    useEffect(() => {
        if (isOpen) {
            setValue(defaultValue);
            // Small timeout to ensure it renders before focusing
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 50);
        }
    }, [isOpen, defaultValue]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onSubmit(value.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                        <input
                            ref={inputRef}
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="Enter name..."
                        />
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!value.trim()}
                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>

            {/* Click outside to close - handled by wrapping div */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
