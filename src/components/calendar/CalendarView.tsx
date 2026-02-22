import { useState, useMemo } from 'react';
import MonthGrid from './MonthGrid';
import DayAgenda from './DayAgenda';
import type { CalendarTask } from '../../data/calendar/types';

interface Props {
    tasks: CalendarTask[];
    onTasksChange: (newTasks: CalendarTask[]) => void;
}

export default function CalendarView({ tasks, onTasksChange }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Format YYYY-MM-DD for fast lookups
    const formatDateStr = (d: Date) => {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const selectedDateStr = formatDateStr(selectedDate);
    const isTodaySelected = selectedDateStr === formatDateStr(new Date());
    const selectedTasks = tasks.filter(t => t.date === selectedDateStr).sort((a, b) => b.createdAt - a.createdAt); // newest first

    const tasksByDate = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const t of tasks) {
            if (!t.completed) {
                counts[t.date] = (counts[t.date] || 0) + 1;
            }
        }
        return counts;
    }, [tasks]);

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const handleToday = () => {
        const now = new Date();
        setCurrentDate(now);
        setSelectedDate(now);
    };

    const handleAddTask = (title: string, description: string) => {
        const newTask: CalendarTask = {
            id: `task-${Date.now()}`,
            title,
            description,
            date: selectedDateStr,
            completed: false,
            createdAt: Date.now()
        };
        onTasksChange([...tasks, newTask]);
    };

    const handleToggleTask = (taskId: string) => {
        onTasksChange(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    };

    const handleDeleteTask = (taskId: string) => {
        onTasksChange(tasks.filter(t => t.id !== taskId));
    };

    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

    return (
        <div className="flex w-full h-full bg-white overflow-hidden animate-in fade-in duration-300">
            {/* Main Calendar Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50/30">
                {/* Header */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white shrink-0">
                    <h1 className="text-xl font-bold text-gray-900">{monthName}</h1>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleToday}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors mr-2 ${isTodaySelected
                                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/20'
                                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900'
                                }`}
                        >
                            Today
                        </button>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                            <button
                                onClick={handlePrevMonth}
                                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={handleNextMonth}
                                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <MonthGrid
                        currentDate={currentDate}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        tasksByDate={tasksByDate}
                    />
                </div>
            </div>

            {/* Sidebar Agenda */}
            <DayAgenda
                selectedDate={selectedDate}
                tasks={selectedTasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
            />
        </div>
    );
}
