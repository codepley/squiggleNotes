import React, { useState } from 'react';
import type { CalendarTask } from '../../data/calendar/types';

interface Props {
    selectedDate: Date;
    tasks: CalendarTask[];
    onAddTask: (title: string, description: string) => void;
    onToggleTask: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
}

export default function DayAgenda({ selectedDate, tasks, onAddTask, onToggleTask, onDeleteTask }: Props) {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }).format(selectedDate);

    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            onAddTask(newTaskTitle.trim(), newTaskDesc.trim());
            setNewTaskTitle('');
            setNewTaskDesc('');
            setIsAdding(false);
        }
    };

    return (
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full shrink-0">
            <div className="p-5 border-b border-gray-100 flex-none">
                <div className="flex flex-row items-center justify-between mb-1">
                    <h2 className="text-xl font-bold text-gray-900">{formattedDate}</h2>
                    {totalCount > 0 && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${completedCount === totalCount
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                : 'bg-red-50 text-red-600 border-red-200'
                            }`}>
                            {completedCount}/{totalCount}
                        </span>
                    )}
                </div>
                <p className="text-sm font-medium text-gray-500">
                    {totalCount} {totalCount === 1 ? 'task' : 'tasks'} today
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {tasks.length === 0 && !isAdding && (
                    <div className="text-center py-10">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">☕</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">No tasks for today</p>
                    </div>
                )}

                {tasks.map(task => (
                    <div
                        key={task.id}
                        className={`group p-3 rounded-xl border flex items-start gap-3 transition-all ${task.completed ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                            }`}
                    >
                        <button
                            onClick={() => onToggleTask(task.id)}
                            className={`mt-0.5 w-5 h-5 flex items-center justify-center rounded-md border shrink-0 transition-colors ${task.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white border-gray-300 hover:border-indigo-400'
                                }`}
                        >
                            {task.completed && (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>

                        <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-semibold truncate ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                {task.title}
                            </h4>
                            {task.description && (
                                <p className={`text-xs mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {task.description}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => onDeleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                            title="Delete Task"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}

                {isAdding && (
                    <form onSubmit={handleSubmit} className="p-3 bg-gray-50 rounded-xl border border-indigo-100 animate-in fade-in zoom-in-95 duration-200">
                        <input
                            type="text"
                            placeholder="Task title..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="w-full bg-white px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2 font-medium"
                            autoFocus
                        />
                        <textarea
                            placeholder="Description (optional)"
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                            className="w-full bg-white px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3 resize-none h-16"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!newTaskTitle.trim()}
                                className="px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                Save Task
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {!isAdding && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full py-2.5 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Task
                    </button>
                </div>
            )}
        </div>
    );
}
