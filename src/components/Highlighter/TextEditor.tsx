import React, { useRef } from "react";

export default function TextEditor() {
    const editorRef = useRef<HTMLDivElement | null>(null);

    function isSelectionInsideEditor(selection: Selection | null) {
        if (!selection || selection.rangeCount === 0) return false;
        const range = selection.getRangeAt(0);
        let node = range.commonAncestorContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode as Node;
        return editorRef.current?.contains(node as Node) ?? false;
    }

    function applyHighlight(color: string) {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) return; // nothing selected
        if (!isSelectionInsideEditor(sel)) return; // outside editor

        const range = sel.getRangeAt(0);
        const extracted = range.extractContents();

        const span = document.createElement("span");
        span.className = "highlight";
        span.style.backgroundColor = color;
        span.appendChild(extracted);

        range.insertNode(span);

        // Normalize the editor to merge text nodes
        editorRef.current?.normalize();

        // Move caret after inserted span
        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(span);
        newRange.collapse(true);
        sel.addRange(newRange);
        editorRef.current?.focus();
    }

    function clearAllHighlights() {
        const editor = editorRef.current;
        if (!editor) return;
        const spans = Array.from(editor.querySelectorAll('span.highlight'));
        spans.forEach(s => {
            const parent = s.parentNode as Node;
            while (s.firstChild) parent.insertBefore(s.firstChild, s);
            parent.removeChild(s);
            parent.normalize?.();
        });
    }

    return (
        <div className="w-full h-full flex flex-col p-6">
            <div className="flex items-center gap-3 mb-4 bg-white p-2 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-700">Highlighter</div>

                <button className="btn" onMouseDown={(e) => e.preventDefault()} onClick={() => applyHighlight('#fff59d')}
                    title="Yellow">
                    <span className="w-4 h-2 rounded-sm" style={{ backgroundColor: '#fff59d' }} />
                    <span className="ml-2 text-sm">Yellow</span>
                </button>

                <button className="btn" onMouseDown={(e) => e.preventDefault()} onClick={() => applyHighlight('#bbf7d0')}
                    title="Green">
                    <span className="w-4 h-2 rounded-sm" style={{ backgroundColor: '#bbf7d0' }} />
                    <span className="ml-2 text-sm">Green</span>
                </button>

                <button className="btn" onMouseDown={(e) => e.preventDefault()} onClick={() => applyHighlight('#fbcfe8')}
                    title="Pink">
                    <span className="w-4 h-2 rounded-sm" style={{ backgroundColor: '#fbcfe8' }} />
                    <span className="ml-2 text-sm">Pink</span>
                </button>

                <div style={{ flex: 1 }} />

                <button className="btn text-sm text-gray-600" onClick={clearAllHighlights}>Clear</button>
            </div>

            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="editor bg-white rounded-md p-4 border border-gray-200 min-h-[280px] text-gray-800"
                role="textbox"
                aria-label="Text editor with highlighter"
            >
                <p>Type or paste some text here. Select a portion and click a color to highlight it.</p>
                <p>The highlight wraps the selection in a &lt;span&gt; with a background-color style.</p>
            </div>
        </div>
    );
}
